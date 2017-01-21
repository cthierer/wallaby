
import crypto from 'crypto'
import { userSession } from '../data-keys'

function initCreateSession(redis, duration = 20 * 60) {
  return async function createSession(ctx, next) {
    const auth = ctx.state.auth || {}
    const provider = auth.provider
    const token = auth.token
    const user = ctx.state.user || {}
    const userId = user.id
    const hash = crypto.createHash('sha256')

    hash.update(token)

    const sessionToken = hash.digest('hex')

    await redis.setAsync(userSession(provider, sessionToken), userId)

    if (duration) {
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
