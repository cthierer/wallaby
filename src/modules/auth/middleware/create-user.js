/**
 * @module wallaby/modules/auth/middleware/create-user
 */

import { userProfile } from '../data-keys'

/**
 * Initialize middleware to create a new user.
 *
 * The generated middleware expects the following objects to be set on
 * `ctx.state`:
 *
 *  - `auth`: includes the `provider` and authenticated access `token` from the
 *    Oauth provider.
 *  - `user`: includes the unique identifier (`id`) for the user in the remote
 *    Oauth application.
 *
 * When executed, the middleware function will create a user profile for the
 * specified user. The user profile is populated with a copy of the data in the
 * `ctx.state.user` object.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 */
function initCreateUser(redis) {
  return async function createUser(ctx, next) {
    const auth = ctx.state.auth || {}
    const provider = auth.provider || null
    const user = ctx.state.user || {}
    const userId = user.id || null

    await redis.hmsetAsync(userProfile(provider, userId), user)
    await next()
  }
}

export default initCreateUser
