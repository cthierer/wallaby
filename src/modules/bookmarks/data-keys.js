/**
 * @module wallaby/modules/bookmarks/data-keys
 */

/**
 * Identifier for history keys.
 * @constant
 * @type {string}
 */
const HISTORY = 'history'

/**
 * Identifier for bookmark keys.
 * @constant
 * @type {string}
 */
const BOOKMARKS = 'bookmarks'

/**
 * Generate a Redis key for tracking the history of Bookmarks the
 * user has made. This history is kept as a sorted set, with priority
 * set by timestamp of when the Bookmark was created/updated.
 * @param {object} user The user creating the bookmark.
 * @param {string} user.provider Oauth provider for the user.
 * @param {any} user.id The unique ID for the user.
 * @returns {string} The generated Redis key.
 */
function userHistory(user) {
  if (!user || !user.provider || !user.id) {
    throw new Error('missing required user information')
  }

  return `${HISTORY}:${user.provider}.${user.id}`
}

/**
 * Generate a Redis key for tracking bookmarks. Bookmarks are a hash keyed by
 * Bookmark ID, and mapped to a JSON string describing the Bookmark.
 * @param {object} user The user creating the bookmark.
 * @param {string} user.provider Oauth provider for the user.
 * @param {any} user.id The unique ID for the user.
 * @returns {string} The generated Redis key.
 */
function userBookmarks(user) {
  if (!user || !user.provider || !user.id) {
    throw new Error('missing required user information')
  }

  return `${BOOKMARKS}:${user.provider}.${user.id}`
}

export { userHistory, userBookmarks }
