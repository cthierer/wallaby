/**
 * @module wallaby/modules/bookmarks/middleware/remove
 */

import { userHistory, userBookmarks } from '../data-keys'

/**
 * Initialize middleware to remove a Bookmark from the datastore.
 *
 * The generated middleware expects for the Bookmark ID to be specified
 * as a named parameter (`id`), and for the `user` object to be loaded on
 * the `ctx.state`.
 *
 * On success, sets a 204 status and ends the request chain.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 */
function initRemove(redis) {
  return async function removeBookmark(ctx) {
    const id = ctx.params.id
    const user = ctx.state.user

    if (!id) {
      throw new Error('missing ID parameter')
    }

    if (!user) {
      throw new Error('missing user')
    }

    await Promise.all([
      redis.hdelAsync(userBookmarks(user), id),
      redis.zremAsync(userHistory(user), id)
    ])

    ctx.status = 204
  }
}

export default initRemove
