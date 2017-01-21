
import { userSession } from '../data-keys'

function initRemoveSession(redis) {
  return async function removeSession(ctx) {
    const session = ctx.state.session || {}
    const provider = session.provider
    const token = session.token

    await redis.delAsync(userSession(provider, token))

    ctx.status = 204
  }
}

export default initRemoveSession
