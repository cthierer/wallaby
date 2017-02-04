/**
 * @module wallaby/modules/bookmarks/middleware/create
 */

import { userHistory, userBookmarks } from '../data-keys'
import Validator from '../../core/validator'
import UserValidator from '../../auth/user-validator'
import BookmarkValidator from '../bookmark-validator'

/**
 * Initialize middleware to create a new Bookmark.
 *
 * The generated middleware expects for the Bookmark ID to be specified
 * as a named parameter (`id`), and for the `user` object to be loaded on
 * the `ctx.state`.
 *
 * On success, sets a 201 status and returns the saved Bookmark.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 */
function initCreate(redis) {
  return async function createBookmark(ctx, next) {
    const id = new Validator(ctx.params.id)
      .exists()
      .get()
    const user = new UserValidator(ctx.state.user)
      .isComplete()
      .get()
    const raw = new BookmarkValidator(ctx.request.body || {}, 'bookmark')
      .exists()
      .matchesSchema()
      .get()

    const updatedAt = raw.updatedAt || (new Date()).toISOString()
    const timestamp = Date.parse(updatedAt) || Date.now()
    const data = Object.assign({}, raw, { id, updatedAt })

    await Promise.all([
      /*
       * Bookmarks are linked to the user, and stored a JSON strings on a hash
       * identified by the Bookmark ID. Only one Bookmark can exist per an ID,
       * meaning that if the user creates multiple Bookmarks for a single ID,
       * only the last will be peristed.
       */
      redis.hsetAsync(userBookmarks(user), id, JSON.stringify(data)),
      /*
       * The Bookmark ID is also added to a sorted set tracked by timestamp,
       * allowing users to request the most recent Bookmarks.
       */
      redis.zaddAsync(userHistory(user), timestamp, id)
    ])

    ctx.status = 201
    ctx.body = {
      status: 'ok',
      result: data
    }

    return next()
  }
}

export default initCreate
