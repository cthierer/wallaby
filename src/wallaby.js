
import { getDataAsJSON, postDataAsJSON, putDataAsJSON, deleteData } from './modules/data/http'

let client = null

function _buildHeaders(auth) {
  if (!auth || !auth.token || !auth.provider) {
    return {}
  }

  return { authorization: `${auth.provider} ${auth.token}` }
}

class WallabyClient {
  constructor(config) {
    this._config = config
  }

  _buildUri(endpoint) {
    return `${this.baseUri}${endpoint}`
  }

  get baseUri() {
    return this._config.base_uri
  }

  get config() {
    return Object.assign({}, this._config)
  }

  get sessionsUri() {
    return this._buildUri(this._config.endpoints.sessions)
  }

  get bookmarksUri() {
    return this._buildUri(this._config.endpoints.bookmarks)
  }

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

  async logoutSession(auth) {
    const url = this.sessionsUri
    const headers = _buildHeaders(auth)

    await deleteData({ url, headers })
  }

  async getBookmarks(auth) {
    const url = this.bookmarksUri
    const headers = _buildHeaders(auth)

    return getDataAsJSON({ url, headers })
  }

  async saveBookmark(id, data, auth) {
    const url = `${this.bookmarksUri}/${id}`
    const headers = _buildHeaders(auth)

    return postDataAsJSON(data, { url, headers })
  }

  async deleteBookmark(id, auth) {
    const url = `${this.bookmarksUri}/${id}`
    const headers = _buildHeaders(auth)

    return deleteData({ url, headers })
  }

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

async function getClient(url = '/config') {
  if (!client) {
    const config = await getDataAsJSON({ url })
    client = new WallabyClient(config)
  }
  return client
}

export default getClient
