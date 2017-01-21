
import { userHistory, userBookmarks } from '../data-keys'

function initRemove(redis) {
  return async function removeBookmark(ctx) {
    const id = ctx.params.id
    const user = ctx.state.user

    if (!id) {
      throw new Error('missing ID parameter')
    }

    if (!user) {
      throw new Error('missing user')
    }

    await Promise.all([
      redis.hdelAsync(userBookmarks(user), id),
      redis.zremAsync(userHistory(user), id)
    ])

    ctx.status = 204
  }
}

export default initRemove
