/**
 * @module wallaby/modules/collections/middleware/list
 */

import UserValidator from '../../auth/user-validator'
import { getCollectionKey } from '../utils'
import { userCollections } from '../data-keys'

/**
 * Initialize middleware to list Collections.
 *
 * The generated middleware expects the `ctx.state.user` object to have been
 * set.
 *
 * On success, sets the body to include the matching results, and ends the
 * request chain.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 */
function initList(redis) {
  return async function listCollections(ctx) {
    const user = new UserValidator(ctx.state.user, 'user').isComplete().get()

    const usersCollections = await redis.smembersAsync(userCollections(user))
    const result = usersCollections.map((title) => {
      const key = getCollectionKey(title)
      return { title, key }
    })

    ctx.body = {
      status: 'ok',
      result,
      total: result.length
    }
  }
}

export default initList
