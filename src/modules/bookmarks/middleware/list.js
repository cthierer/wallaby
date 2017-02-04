/**
 * @module wallaby/modules/bookmarks/middleware/list
 */

import { userHistory, userBookmarks } from '../data-keys'

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
    const limitIdx = offset + (limit - 1)
    const user = ctx.state.user

    if (!user) {
      throw new Error('missing user')
    }

    const bookmarkIds = await redis.zrevrangeAsync(userHistory(user), offset, limitIdx)
    const total = await redis.hlenAsync(userBookmarks(user))

    if (bookmarkIds && bookmarkIds.length) {
      const bookmarks = await redis.hmgetAsync(userBookmarks(user), bookmarkIds)
      const result = bookmarks
        .map(bookmarkStr => JSON.parse(bookmarkStr))
        .map(bookmark => Object.assign(bookmark, {
          page: bookmark.page + 1,
          panel: bookmark.panel + 1
        }))

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
