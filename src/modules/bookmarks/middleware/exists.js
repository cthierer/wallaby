/**
 * @module wallaby/modules/bookmarks/middleware/exists
 */

import { userBookmarks } from '../data-keys'
import Validator from '../../core/validator'
import UserValidator from '../../auth/user-validator'

/**
 * Initialize middleware to check if a Bookmark exists.
 *
 * The generated middleware expects for the Bookmark ID to be specified
 * as a named parameter (`id`), and for the `user` object to be loaded on
 * the `ctx.state`.
 *
 * If a Bookmark is not found, then the middleware ends the request with a
 * 404 status. Otherwise, the middleware chain continues.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 */
function initExists(redis) {
  return async function bookmarkExists(ctx, next) {
    const id = new Validator(ctx.params.id, 'id').exists().get()
    const user = new UserValidator(ctx.state.user, 'user').isComplete().get()

    const exists = await redis.hexistsAsync(userBookmarks(user), id)

    if (exists !== 1) {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        code: 'bookmarks:notFound',
        message: `Bookmark for "${id}" not found`
      }
      return
    }

    await next()
  }
}

export default initExists
