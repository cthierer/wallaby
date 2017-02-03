/**
 * @module wallaby/modules/bookmarks/middleware/create
 */

import { saveBookmark } from '../data-utils'

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
 * @todo Validate the parsed body JSON structure.
 */
function initCreate(redis) {
  return async function createBookmark(ctx) {
    const id = ctx.params.id
    const updatedAt = (new Date()).toISOString()
    const data = Object.assign(ctx.request.body || {}, { id, updatedAt })
    const user = ctx.state.user

    if (!id) {
      throw new Error('missing ID parameter')
    }

    if (!user) {
      throw new Error('missing user')
    }

    await saveBookmark(data, user, redis)

    ctx.status = 201
    ctx.body = {
      status: 'ok',
      result: data
    }
  }
}

export default initCreate
