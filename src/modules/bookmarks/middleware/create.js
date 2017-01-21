
import { userHistory, userBookmarks } from '../data-keys'

function initCreate(redis) {
  return async function createBookmark(ctx) {
    const id = ctx.params.id
    const data = Object.assign(ctx.request.body || {}, { id })
    const user = ctx.state.user

    if (!id) {
      throw new Error('missing ID parameter')
    }

    if (!user) {
      throw new Error('missing user')
    }

    await Promise.all([
      redis.hsetAsync(userBookmarks(user), id, JSON.stringify(data)),
      redis.zaddAsync(userHistory(user), Date.now(), id)
    ])

    ctx.status = 201
    ctx.body = {
      status: 'ok',
      result: data
    }
  }
}

export default initCreate
