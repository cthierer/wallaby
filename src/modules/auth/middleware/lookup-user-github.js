
import { getDataAsJSON } from '../../data/http'

function initLookupUser(url) {
  return async function lookupUser(ctx, next) {
    const auth = ctx.state.auth || {}
    const token = auth.token || null

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
