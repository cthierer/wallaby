
const HISTORY = 'history'
const BOOKMARKS = 'bookmarks'

function userHistory(user) {
  return `${HISTORY}:${user.provider}.${user.id}`
}

function userBookmarks(user) {
  return `${BOOKMARKS}:${user.provider}.${user.id}`
}

export { userHistory, userBookmarks }
