/**
 * @module wallaby/wallaby
 */

import { getDataAsJSON, postDataAsJSON, putDataAsJSON, deleteData } from './modules/data/http'

/**
 * Treat the client as a singleton - this is the initialized instance.
 */
let client = null

/**
 * Build the Authorization header for the given auth object.
 * @param {object} auth Auth object.
 * @param {string} auth.provider Oauth provider for the token.
 * @param {string} auth.token Session token.
 * @returns {object} Headers reflecting the authorization object.
 * @todo Trigger error if missing authorization headers on an endpoint that
 *  require authorization.
 */
function _buildHeaders(auth) {
  if (!auth || !auth.token || !auth.provider) {
    return {}
  }

  return { authorization: `${auth.provider} ${auth.token}` }
}

/**
 * Define interactions with the API.
 * @class
 */
class WallabyClient {
  /**
   * @constructor
   * @param {object} config The configuration object for the API.
   * @param {string} config.base_uri The full domain name to the remote API.
   * @param {object} config.endpoints Defines pats to the various endpoints.
   */
  constructor(config) {
    this._config = config
  }

  /**
   * Build a full URL to the specified endpoint.
   * @param {string} endpoint
   * @returns {string} The generated URL.
   */
  _buildUri(endpoint) {
    return `${this.baseUri}${endpoint}`
  }

  /**
   * The base URL for the API.
   * @property {string}
   */
  get baseUri() {
    return this._config.base_uri
  }

  /**
   * The application configuration object.
   * @property {object}
   */
  get config() {
    return Object.assign({}, this._config)
  }

  /**
   * Full URL to the sessions endpoint on the API.
   * @property {string}
   */
  get sessionsUri() {
    return this._buildUri(this._config.endpoints.sessions)
  }

  /**
   * Full URL to the bookmarks endpoint on the API.
   * @property {string}
   */
  get bookmarksUri() {
    return this._buildUri(this._config.endpoints.bookmarks)
  }

  /**
   * Ping the session endpoint to extend the user's session.
   * @param {object} auth
   * @returns {boolean} Whether or not the session is still active.
   */
  async pingSession(auth) {
    const url = this.sessionsUri
    const headers = _buildHeaders(auth)

    try {
      await putDataAsJSON({}, { url, headers })
    } catch (e) {
      return false
    }

    return true
  }

  /**
   * Logout the user.
   * @param {object} auth
   * @returns {boolean} True if the session was ended.
   */
  async logoutSession(auth) {
    const url = this.sessionsUri
    const headers = _buildHeaders(auth)

    await deleteData({ url, headers })

    return true
  }

  /**
   * Retrieve bookmarks for the user.
   * @param {object} auth
   * @returns {object} Result of the API call, including a `result` attribute
   *  with an array of Bookmarks.
   */
  async getBookmarks(auth) {
    const url = this.bookmarksUri
    const headers = _buildHeaders(auth)

    return getDataAsJSON({ url, headers })
  }

  /**
   * Generate an export of all bookmarks in the application.
   * @param {object} auth
   * @returns {array} Result of the API call: an array of bookmark objects.
   */
  async exportBookmarks(auth) {
    const url = `${this.bookmarksUri}/export`
    const headers = _buildHeaders(auth)

    return getDataAsJSON({ url, headers })
  }

  /**
   * Import multiple bookmarks into the application.
   * @param {object} auth
   * @param {array} bookmarks Collection of bookmark objects to import.
   * @returns {object} Result of the API call, including a `total` attribute
   *  enumerating the number of boomkarks imported.
   */
  async importBookmarks(auth, bookmarks) {
    const url = `${this.bookmarksUri}/import`
    const headers = _buildHeaders(auth)

    return postDataAsJSON(bookmarks, { url, headers })
  }

  /**
   * Save a bookmark.
   * @param {string} id The Bookmark ID.
   * @param {object} data Data associated with the bookmark.
   * @param {object} auth
   * @returns {object} The saved Bookmark entity.
   * @todo Validate `data` object.
   */
  async saveBookmark(id, data, auth) {
    const url = `${this.bookmarksUri}/${id}`
    const headers = _buildHeaders(auth)

    return postDataAsJSON(data, { url, headers })
  }

  /**
   * Delete a bookmark.
   * @param {string} id The ID of the Bookmark to delete.
   * @param {object} auth
   * @returns {boolean} True if the bookmark was deleted.
   */
  async deleteBookmark(id, auth) {
    const url = `${this.bookmarksUri}/${id}`
    const headers = _buildHeaders(auth)

    await deleteData({ url, headers })

    return true
  }

  /**
   * Parse a JSON state string, and determine if the session referenced in it
   * is still valid. If so, then return the parsed state.
   * @param {string} stateStr The string representation of the state.
   * @returns {object} The parsed `stateStr` if the session is still valid, or
   *  an empty object if not.
   * @todo Move out of this class - not specific to the API.
   */
  async loadStateString(stateStr) {
    if (typeof stateStr === 'string') {
      const state = JSON.parse(stateStr)

      if (state.auth) {
        const active = await this.pingSession(state.auth)

        if (active) {
          return state
        }
      }
    }

    return {}
  }
}

/**
 * Factory method to retrieve or generate an API client, using the
 * configuration loaded a the specified endpoint.
 * @param {string} [url='/config'] The endpoint to pull the client
 *  configuration from.
 * @returns {WallabyClient} The initialized API client.
 */
async function getClient(url = '/config') {
  if (!client) {
    const config = await getDataAsJSON({ url })
    client = new WallabyClient(config)
  }
  return client
}

export default getClient
