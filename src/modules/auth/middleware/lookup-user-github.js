/**
 * @module wallaby/modules/auth/middlware/lookup-user-github
 */

import { getDataAsJSON } from '../../data/http'

/**
 * Initialize middleware to lookup a user from Github.
 *
 * The generated middleware expects `ctx.state.auth.token` to be set to the
 * Github access token retrieved from the Oauth authentication.
 *
 * Sets the `user` object on `ctx.state`, including the User ID (`id`) and
 * account name (`username`).
 *
 * Note that the user information is not persisted - it is only looked up and
 * loaded onto the state.
 *
 * @param {string} url The URL to the Github endpoint to query for user
 *  information.
 * @returns {function} The middleware function.
 */
function initLookupUser(url) {
  return async function lookupUser(ctx, next) {
    const auth = ctx.state.auth || {}
    const token = auth.token || null

    if (!token) {
      throw new Error('missing required value: "token"')
    }

    const user = await getDataAsJSON({
      url,
      method: 'GET',
      query: { access_token: token }
    }).then((body) => {
      const id = body.id
      const username = body.login
      return { id, username }
    })

    ctx.state.user = user

    await next()
  }
}

export default initLookupUser
