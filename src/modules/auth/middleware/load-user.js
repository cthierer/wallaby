
import { userSession } from '../data-keys'

function initLoadUser(redis, sessionDuration = 20 * 60) {
  return async function loadUser(ctx, next) {
    const headers = ctx.headers || {}
    const auth = headers.authorization || null
    const [provider, token] = auth && typeof auth.split === 'function'
      ? auth.split(' ')
      : []

    if (!provider || !token) {
      ctx.status = 401
      ctx.body = {
        status: 'error',
        code: 'auth:badHeader',
        message: 'Must provide a valid "Authorization" header'
      }
      return
    }

    const userId = await redis.getAsync(userSession(provider, token))

    if (!userId) {
      ctx.status = 401
      ctx.body = {
        status: 'error',
        code: 'auth:noSession',
        message: 'Create a session using the `GET /auth` endpoint'
      }
      return
    }

    ctx.state.user = {
      id: userId,
      provider
    }

    ctx.state.session = {
      token,
      provider
    }

    if (sessionDuration) {
      await redis.expireAsync(userSession(provider, token), sessionDuration)
    }

    await next()
  }
}

export default initLoadUser
