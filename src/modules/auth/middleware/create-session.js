/**
 * @module wallaby/modules/auth/middleware/create-session
 */

import crypto from 'crypto'
import { userSession } from '../data-keys'

/**
 * Initialize middleware to create a new application session.
 *
 * The generated middleware expects the following objects to be set on
 * `ctx.state`:
 *
 *  - `auth`: includes the `provider` and authenticated access `token` from the
 *    Oauth provider.
 *  - `user`: includes the unique identifier (`id`) for the user in the remote
 *    Oauth application.
 *
 * When executed, the middleware function will generate a unique session token
 * to be included in future requests requring authorization. The session is
 * linked to an application profile for the authenticated user.
 *
 * The middleware sets the `session` object on context object, including
 * `provider` and `token`.
 *
 * @param {object} redis Initialized Redis client.
 * @param {integer} duration Number of seconds that the session should last
 *  before it auto-expires. If set to a falsy value, the session will never
 *  expire.
 * @returns {function} The middleware function.
 */
function initCreateSession(redis, duration) {
  return async function createSession(ctx, next) {
    const auth = ctx.state.auth || {}
    const provider = auth.provider
    const token = auth.token
    const user = ctx.state.user || {}
    const userId = user.id
    const hash = crypto.createHash('sha256')

    hash.update(token)

    // hash the oauth token to create the application token
    const sessionToken = hash.digest('hex')

    await redis.setAsync(userSession(provider, sessionToken), userId)

    if (duration && duration > 0) {
      await redis.expireAsync(userSession(provider, sessionToken), duration)
    }

    ctx.state.session = {
      provider,
      token: sessionToken
    }

    await next()
  }
}

export default initCreateSession
