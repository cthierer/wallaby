
import url from 'url'
import querystring from 'querystring'
import uuid from 'uuid'
import { authReferer } from '../data-keys'

function initInitOauth(redis, baseUrl, params) {
  return async function initOauth(ctx) {
    const referer = ctx.headers.referer
    const state = uuid.v4()
    const qs = querystring.stringify(Object.assign({ state }, params))

    if (referer) {
      const refererParts = url.parse(referer)
      const refererHost = `${refererParts.protocol}//${refererParts.host}`

      await redis.setAsync(authReferer(state), refererHost)
      await redis.expireAsync(authReferer(state), 2 * 60)
    }

    ctx.redirect(`${baseUrl}?${qs}`)
  }
}

export default initInitOauth
