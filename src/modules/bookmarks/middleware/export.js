/**
 * @module wallaby/modules/bookmarks/middleware/export
 */

import { userBookmarks } from '../data-keys'
import { toAppModel } from '../data-utils'

/**
 * Initialize middleware to export Bookmarks.
 *
 * The generated middleware expects the `ctx.state.user` object to have been
 * set.
 *
 * On success, sets the body to include the matching results.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 */
function initExport(redis) {
  return async function exportBoomarks(ctx) {
    const user = ctx.state.user

    if (!user) {
      throw new Error('missing user')
    }

    const bookmarks = await redis.hvalsAsync(userBookmarks(user))
    const result = toAppModel(bookmarks)

    ctx.body = result || []
  }
}

export default initExport
