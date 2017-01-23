/**
 * @module wallaby/modules/auth/middlweare/remove-session
 */

import { userSession } from '../data-keys'

/**
 * Initialize middleware to end a user's session.
 *
 * The generated middleware expects session information to have already
 * been parsed and set on the `ctx.state.session` object, including `provider`
 * and `token`.
 *
 * Ends the request with a 204 status.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 */
function initRemoveSession(redis) {
  return async function removeSession(ctx) {
    const session = ctx.state.session || {}
    const provider = session.provider
    const token = session.token

    if (!provider || !token) {
      throw new Error('missing required "provider" or "token" identifiers')
    }

    await redis.delAsync(userSession(provider, token))

    ctx.status = 204
  }
}

export default initRemoveSession
