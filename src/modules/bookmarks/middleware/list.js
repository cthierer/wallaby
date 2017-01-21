
import { userHistory, userBookmarks } from '../data-keys'

function initList(redis, defaultLimit = 10, defaultOffset = 0) {
  return async function listBookmarks(ctx) {
    const limit = Number.parseInt(ctx.query.limit) || defaultLimit
    const offset = Number.parseInt(ctx.query.offset) || defaultOffset
    const user = ctx.state.user

    if (!user) {
      throw new Error('missing user')
    }

    const bookmarkIds = await redis.zrevrangeAsync(userHistory(user), offset, limit)
    const total = await redis.hlenAsync(userBookmarks(user))

    if (bookmarkIds && bookmarkIds.length) {
      const bookmarks = await redis.hmgetAsync(userBookmarks(user), bookmarkIds)
      const result = bookmarks.map(bookmarkStr => JSON.parse(bookmarkStr))

      ctx.body = {
        status: 'ok',
        result,
        total
      }

      return
    }

    ctx.body = {
      status: 'ok',
      result: [],
      total
    }
  }
}

export default initList
