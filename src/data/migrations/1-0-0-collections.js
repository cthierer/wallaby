/**
 * @module wallaby/data/migrations/1-0-0-collections
 */

import Promise from 'bluebird'
import { KEY_USERS } from '../../modules/auth/data-keys'
import { userBookmarks } from '../../modules/bookmarks/data-keys'
import { userCollections, collectionMembers } from '../../modules/collections/data-keys'
import { getCollectionName, getCollectionKey } from '../../modules/collections/utils'

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
 * Generate collections for all existing bookmarks.
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
      const meta = bookmark.meta || {}
      const title = meta.title || ''

      if (typeof title !== 'string' || title.length < 1) {
        return
      }

      const collectionTitle = getCollectionName(title)
      const collectionKey = getCollectionKey(collectionTitle)

      updates.sadd(userCollections(user), collectionTitle)
      updates.sadd(collectionMembers(user, collectionKey), bookmarkId)
    })
  })

  await updates.execAsync()
}

export default doUpdate
export { APPLIES_TO_VERSION }
