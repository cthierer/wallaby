
import { userHistory, userBookmarks } from './data-keys'

/**
 * Convert an array of database models to application models.
 * @param {string[]} values Collection of JSON serialized strings from the
 *  database.
 * @returns {object[]} Application models generated from the JSON strings.
 */
function toAppModel(values) {
  return values
    .map(bookmarkStr => JSON.parse(bookmarkStr))
    .map(bookmark => Object.assign(bookmark, {
      page: bookmark.page + 1,
      panel: bookmark.panel + 1
    }))
}

/**
 * Save a bookmark in the database. Updates the bookmark history using the
 * `data.updatedAt` attribute.
 * @param {object} data The bookmark data to save.
 * @param {object} user The user to associated the bookmark with.
 * @param {object} redis Initailized Redis client.
 * @returns {Promise} Resolves when the bookmark has been saved.
 */
function saveBookmark(data, user, redis) {
  const id = data.id
  const timestamp = Date.parse(data.updatedAt) || Date.now()

  if (!id) {
    throw new Error('invalid bookmark: missing id')
  }

  return Promise.all([
    /*
     * Bookmarks are linked to the user, and stored a JSON strings on a hash
     * identified by the Bookmark ID. Only one Bookmark can exist per an ID,
     * meaning that if the user creates multiple Bookmarks for a single ID,
     * only the last will be peristed.
     */
    redis.hsetAsync(userBookmarks(user), id, JSON.stringify(data)),
    /*
     * The Bookmark ID is also added to a sorted set tracked by timestamp,
     * allowing users to request the most recent Bookmarks.
     */
    redis.zaddAsync(userHistory(user), timestamp, id)
  ])
}

export {
  toAppModel,
  saveBookmark
}
