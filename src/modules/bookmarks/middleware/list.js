/**
 * @module wallaby/modules/bookmarks/middleware/list
 */

import Promise from 'bluebird'
import { userHistory, userBookmarks } from '../data-keys'
import { collectionMembers } from '../../collections/data-keys'
import Validator from '../../core/validator'
import UserValidator from '../../auth/user-validator'

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
 * @todo Refactor and cleanup filtering queries.
 */
function initList(redis, defaultLimit = 10, defaultOffset = 0) {
  return async function listBookmarks(ctx) {
    const user = new UserValidator(ctx.state.user, 'user').isComplete().get()
    const limit = new Validator(Number.parseInt(ctx.query.limit) || defaultLimit)
      .isNumber()
      .isPositiveOrZero()
      .get()
    const offset = new Validator(Number.parseInt(ctx.query.offset) || defaultOffset)
      .isNumber()
      .isPositiveOrZero()
      .get()
    const collection = ctx.query.collection

    const limitIdx = offset + (limit - 1)
    // TODO reduce branching logic - break into multiple paths based on filter
    const filtered = collection
      ? await redis.smembersAsync(collectionMembers(user, collection))
      : await redis.zrevrangeAsync(userHistory(user), offset, limitIdx)
    const total = collection
      ? filtered.length
      : await redis.hlenAsync(userBookmarks(user))
    // TODO optimize ordering bookmark IDs for filtered bookmarks
    const bookmarkIds = collection
      ? (await Promise.reduce(filtered, async (ordered, id) => {
        const rank = await redis.zrevrankAsync(userHistory(user), id)
        ordered[rank] = id
        return ordered
      }, [])).filter(id => id !== undefined && id !== null).slice(offset, limitIdx + 1)
      : filtered

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
