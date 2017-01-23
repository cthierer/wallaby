/**
 * @module wallaby/modules/auth/middlware/oauth-callback-github
 */

import { getDataAsJSON } from '../../data/http'
import { authReferer } from '../data-keys'

/**
 * Initialize middleware to handle a Github Oauth callback. This is to
 * handle the second phase of the Oauth procedure.
 *
 * Given the `code` and `state` parameters in the querystring of the request,
 * triggers a call to Github to verify the request and create an access token.
 *
 * When executed, loads the `ctx.state.auth` object, which includes:
 *
 *  - `token`: the generated Github access token, which can be used to make
 *    Github API requests on behalf of the user.
 *  - `provider`: unique string to identify that Github provided the Oauth
 *    credentials.
 *  - `referer`: the host that originally made the Oauth request. I.e., if the
 *    Oauth process started from "www.example.com/my-page", the referer here
 *    would be "www.example.com".
 *
 * @param {object} redis Initialized Redis client.
 * @param {string} url URL to the Github access token endpoint.
 * @param {object} params Additional parameters to pass to Github when
 *  requesting the access token.
 * @param {string} [provider=github] The identifier for the Github provider.
 * @returns {function} The middleware function.
 */
function initOauthCallback(redis, url, params, provider = 'github') {
  return async function githubOauthCallback(ctx, next) {
    const code = ctx.query.code
    const state = ctx.query.state

    if (!code || !state) {
      throw new Error('missing "code" or "state" parameters')
    }

    const referer = await redis.getAsync(authReferer(state))

    if (!referer) {
      throw new Error('invalid auth state')
    }

    const token = await getDataAsJSON({
      url,
      method: 'POST',
      body: Object.assign({ code, state }, params),
      headers: { accept: 'application/json' }
    }).then(body => body.access_token)

    ctx.state.auth = { token, provider, referer }

    await next()
  }
}

export default initOauthCallback
