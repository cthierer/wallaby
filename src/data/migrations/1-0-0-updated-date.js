/**
 * @module wallaby/data/migrations/1-0-0-updated-date
 */

import Promise from 'bluebird'
import { KEY_USERS } from '../../modules/auth/data-keys'
import { userBookmarks, userHistory } from '../../modules/bookmarks/data-keys'

/**
 * Specify the version of the database to apply this script to.
 * @constant
 * @type {string}
 */
const APPLIES_TO_VERSION = '1.0.0'

/**
 * Default to denote start/end of a cursor iteration in Redis.
 * @constant
 * @type {string}
 */
const REDIS_CURSOR_DEFAULT = '0'

/**
 * Update all bookmarks to include the `updatedAt` attribute, set based
 * on the history ZSET in the Redis database.
 * @param {object} redis Redis connection.
 */
async function doUpdate(redis) {
  // recursively lookup keys using scan
  async function getAllKeys(cursor = REDIS_CURSOR_DEFAULT, ...args) {
    const [nextCursor, keys] = await redis.scanAsync(cursor, ...args)

    if (nextCursor === REDIS_CURSOR_DEFAULT) {
      return keys
    }

    return keys.concat(await getAllKeys(nextCursor, ...args))
  }

  const keyPrefix = `${KEY_USERS}:`
  const updates = redis.multi()

  // get user keys
  const userKeys = await getAllKeys('0', 'MATCH', `${keyPrefix}*`)
  // parse user keys into user objects
  const users = userKeys
    .map(userKey => userKey.substring(keyPrefix.length))
    .map((idStr) => {
      const [provider, id] = idStr.split('.', 2)
      return { provider, id }
    })

  // iterate over each user, and get the bookmarks for that user
  await Promise.map(users, async (user) => {
    const bookmarkIds = await redis.hkeysAsync(userBookmarks(user))
    // iterate over each bookmark, and get the updated timestamp for the user
    await Promise.map(bookmarkIds, async (bookmarkId) => {
      const bookmarkRaw = await redis.hgetAsync(userBookmarks(user), bookmarkId)
      const bookmark = JSON.parse(bookmarkRaw)
      const updatedTimestamp = await redis.zscoreAsync(userHistory(user), bookmarkId)
      const updatedDate = new Date(Number.parseInt(updatedTimestamp))
      const updatedBookmark = Object.assign(bookmark, { updatedAt: updatedDate.toISOString() })
      // using multi for transaction control - either update everything or rollback
      updates.hset(userBookmarks(user), bookmarkId, JSON.stringify(updatedBookmark))
    })
  })

  // execute all write operations as a single transaction
  await updates.execAsync()
}

export default doUpdate
export { APPLIES_TO_VERSION }
