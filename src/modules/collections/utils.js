/**
 * @module wallaby/modules/collections/utils
 */

/**
 * Parse a title into a collection name by extracting the value from before the
 * first "#" symbol.
 * @param {string} fromTitle The bookmark title.
 * @returns {string} The collection title.
 */
function getCollectionName(fromTitle) {
  return fromTitle
    .split('#', 2)[0]
    .trim()
}

/**
 * Create a unique key from a collection title. The same key will be generated
 * for the same input.
 * @param {string} fromName The collection title.
 * @returns {string} A unique key.
 */
function getCollectionKey(fromName) {
  return fromName
    .toLowerCase()
    .replace(/\W+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
}

export {
  getCollectionName,
  getCollectionKey
}
