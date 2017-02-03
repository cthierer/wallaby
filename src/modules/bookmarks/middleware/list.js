/**
 * @module wallaby/modules/bookmarks/middleware/list
 */

import { userHistory, userBookmarks } from '../data-keys'
import { toAppModel } from '../data-utils'

/**
 * Initialize middleware to list Bookmarks.
 *
 * The generated middleware expects the `ctx.state.user` object to have been
 * set. Additionally, `limit` and `offset` parameters may be included in the
 * request's querystring to page through results.
 *
 * On success, sets the body to include the matching results, and ends the
 * request chain.
 *
 * @param {object} redis Initialized Redis client.
 * @param {integer} [defaultLimit=10] The default number of Bookmarks to
 *  include on a single page.
 * @param {integer} [defaultOffset=0] The default offset to use.
 * @returns {function} The middleware function.
 * @todo Enhance input parameter validation.
 */
function initList(redis, defaultLimit = 10, defaultOffset = 0) {
  return async function listBookmarks(ctx) {
    const limit = Number.parseInt(ctx.query.limit) || defaultLimit
    const offset = Number.parseInt(ctx.query.offset) || defaultOffset
    const user = ctx.state.user

    if (!user) {
      throw new Error('missing user')
    }

    const bookmarkIds = await redis.zrevrangeAsync(userHistory(user),
      offset >= 0 ? offset : defaultOffset, limit > 0 ? (limit - 1) : defaultLimit)
    const total = await redis.hlenAsync(userBookmarks(user))

    if (bookmarkIds && bookmarkIds.length) {
      const bookmarks = await redis.hmgetAsync(userBookmarks(user), bookmarkIds)
      const result = toAppModel(bookmarks)

      ctx.body = {
        status: 'ok',
        result,
        total
      }

      return
    }

    ctx.body = {
      status: 'ok',
      result: [],
      total
    }
  }
}

export default initList
