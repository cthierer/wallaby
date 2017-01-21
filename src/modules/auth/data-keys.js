
const SESSIONS = 'sessions'
const USERS = 'users'
const REFERERS = 'referers'

function userSession(provider, token) {
  return `${SESSIONS}:${provider}.${token}`
}

function userProfile(provider, id) {
  return `${USERS}:${provider}.${id}`
}

function authReferer(state) {
  return `${REFERERS}:${state}`
}

export { userSession, userProfile, authReferer }
