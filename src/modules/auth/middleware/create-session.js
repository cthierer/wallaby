
import { userSession } from '../data-keys'

function initCreateSession(redis, duration = 20 * 60) {
  return async function createSession(ctx, next) {
    const auth = ctx.state.auth || {}
    const provider = auth.provider
    const token = auth.token
    const user = ctx.state.user || {}
    const userId = user.id

    await redis.setAsync(userSession(provider, token), userId)

    if (duration) {
      await redis.expireAsync(userSession(provider, token), duration)
    }

    await next()
  }
}

export default initCreateSession
