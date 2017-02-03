/**
 * @module wallaby/modules/bookmarks/middleware/import
 */

import Promise from 'bluebird'
import { saveBookmark } from '../data-utils'

/**
 * Initialize middleware to import Bookmarks.
 *
 * The generated middleware expects the `ctx.state.user` object to have been
 * set.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 * @todo Validate imported data.
 */
function initImport(redis) {
  return async function importBookmarks(ctx) {
    const data = ctx.request.body
    const user = ctx.state.user

    if (!data || !Array.isArray(data)) {
      throw new Error('invalid data body: expected an array of bookmarks')
    }

    if (!user) {
      throw new Error('missing user')
    }

    await Promise.map(data, bookmark => saveBookmark(bookmark, user, redis))

    ctx.status = 201
    ctx.body = { status: 'ok', total: data.length }
  }
}

export default initImport
