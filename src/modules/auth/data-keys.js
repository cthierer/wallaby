/**
 * @module wallaby/modules/auth/data-keys
 */

/**
 * Identifier for session keys.
 * @constant
 * @type {string}
 */
const SESSIONS = 'sessions'

/**
 * Identifier for user keys.
 * @constant
 * @type {string}
 */
const USERS = 'users'

/**
 * Idnetiifer for referers keys.
 * @constant
 * @type {string}
 */
const REFERERS = 'referers'

/**
 * Generate a Redis key to reference session information for a particular
 * user, identified using a provider and session token. Session information
 * includes the user ID, which links records to particular users in the
 * application.
 * @param {string} provider The Oauth provider.
 * @param {string} token The session token.
 * @returns {string} The generated Redis key.
 */
function userSession(provider, token) {
  if (!provider || !token) {
    throw new Error('missing required parameters: "provider", "token"')
  }

  return `${SESSIONS}:${provider}.${token}`
}

/**
 * Generate a Redis key to reference a user's profile. The user's profile
 * includes additional information about the user.
 * @param {string} provider The Oauth provider.
 * @param {any} id The ID of the user.
 * @returns {string} The generated Redis key.
 */
function userProfile(provider, id) {
  if (!provider || !id) {
    throw new Error('missing required parameters: "provider", "id"')
  }

  return `${USERS}:${provider}.${id}`
}

/**
 * Generate a Redis key to reference referer information. Referer information
 * tracks the source of Oauth requests, and is used to deliver the
 * authentication credentials back to the intended source.
 * @param {string} state The state key for the Oauth procedure.
 * @returns {string} The generated Redis key.
 */
function authReferer(state) {
  if (!state) {
    throw new Error('missing required parameter: "state"')
  }

  return `${REFERERS}:${state}`
}

export { userSession, userProfile, authReferer }
