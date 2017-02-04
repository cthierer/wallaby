/**
 * @module wallaby/modules/collections/data-keys
 */

/**
 * Identifier for collection keys.
 * @constant
 * @type {string}
 */
const COLLECTIONS = 'collections'

/**
 * Identifier for collection members.
 * @constant
 * @type {string}
 */
const COLLECTION_MEMBERS = 'collections:members'

/**
 * Generate a Redis key for tracking the collections associated with a user.
 * Collections are kept as a Set.
 * @param {object} user The user owning the collection.
 * @param {string} user.provider Oauth provider for the user.
 * @param {any} user.id The unique ID for the user.
 * @returns {string} The generated Redis key.
 */
function userCollections(user) {
  if (!user || !user.provider || !user.id) {
    throw new Error('missing required user information')
  }

  return `${COLLECTIONS}:${user.provider}.${user.id}`
}

/**
 * Generate a Redis key for tracking the bookmarks associated with each
 * collection, stored as a Set.
 * @param {object} user The user owning the collection.
 * @param {string} user.provider Oauth provider for the user.
 * @param {any} user.id The unique ID for the user.
 * @param {string} collection The collection key to get bookmarks for.
 * @returns {string} The generated Redis key.
 */
function collectionMembers(user, collection) {
  if (!user || !user.provider || !user.id) {
    throw new Error('missing required user information')
  }

  if (!collection) {
    throw new Error('missing required collection information')
  }

  return `${COLLECTION_MEMBERS}:${user.provider}.${user.id}:${collection}`
}

export {
  userCollections,
  collectionMembers
}
