
import { userSession } from '../data-keys'

function initRemoveSession(redis) {
  return async function removeSession(ctx) {
    const auth = ctx.state.auth || {}
    const provider = auth.provider
    const token = auth.token

    await redis.delAsync(userSession(provider, token))

    ctx.status = 204
  }
}

export default initRemoveSession
