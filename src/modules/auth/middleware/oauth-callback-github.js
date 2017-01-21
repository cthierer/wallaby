
import { getDataAsJSON } from '../../data/http'
import { authReferer } from '../data-keys'

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
