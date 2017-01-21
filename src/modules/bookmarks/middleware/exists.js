
import { userBookmarks } from '../data-keys'

function initExists(redis) {
  return async function bookmarkExists(ctx, next) {
    const id = ctx.params.id
    const user = ctx.state.user

    if (!id) {
      throw new Error('missing ID parameter')
    }

    if (!user) {
      throw new Error('missing user')
    }

    const exists = await redis.hexistsAsync(userBookmarks(user), id)

    if (exists !== 1) {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        code: 'bookmarks:notFound',
        message: `Bookmark for "${id}" not found`
      }
      return
    }

    await next()
  }
}

export default initExists
