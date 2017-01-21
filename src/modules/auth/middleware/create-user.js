
import { userProfile } from '../data-keys'

function initCreateUser(redis) {
  return async function createUser(ctx, next) {
    const auth = ctx.state.auth || {}
    const provider = auth.provider || null
    const user = ctx.state.user || {}
    const userId = user.id || null

    await redis.hmsetAsync(userProfile(provider, userId), user)
    await next()
  }
}

export default initCreateUser
