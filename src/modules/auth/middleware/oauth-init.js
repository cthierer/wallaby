
import url from 'url'
import querystring from 'querystring'
import uuid from 'uuid'
import { authReferer } from '../data-keys'

/**
 * Number of seconds before the Oauth `state` key expires. This means that the
 * user must complete the Oauth procedure under this time. Set to falsy to not
 * set an expiration.
 * @constant
 * @type {integer}
 */
const STATE_TIMEOUT = 120

/**
 * Initialize middleware to initilize an Oauth request to a specific Oauth
 * provider.
 *
 * This middleware generates a unique state key for the Oauth request, which
 * is linked to the referer who originally made the request. When the Oauth
 * procedure is finished, the state key must match.
 *
 * This redirects the user to the remote Oauth provider to authenticate.
 *
 * @param {object} redis Initialized Redis client.
 * @param {string} baseUrl The URL of the remote Oauth provider to redirect the
 *  user to.
 * @param {object} params Additional parameters to include in the request to
 *  the remote provider.
 * @returns {function} The middleware function.
 * @todo Generalize state key generation to not be Github-specific.
 */
function initInitOauth(redis, baseUrl, params) {
  return async function initOauth(ctx) {
    const referer = ctx.headers.referer
    const state = uuid.v4()
    const qs = querystring.stringify(Object.assign({ state }, params))

    if (referer) {
      const refererParts = url.parse(referer)
      const refererHost = `${refererParts.protocol}//${refererParts.host}`

      await redis.setAsync(authReferer(state), refererHost)

      if (STATE_TIMEOUT && STATE_TIMEOUT > 0) {
        await redis.expireAsync(authReferer(state), STATE_TIMEOUT)
      }
    }

    ctx.redirect(`${baseUrl}?${qs}`)
  }
}

export default initInitOauth
