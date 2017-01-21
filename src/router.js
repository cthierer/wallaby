
import Router from 'koa-router'
import config from 'config'
import getClient from './modules/data/client'
import initOauth from './modules/auth/middleware/oauth-init'
import getToken from './modules/auth/middleware/oauth-callback-github'
import lookupUser from './modules/auth/middleware/lookup-user-github'
import createUser from './modules/auth/middleware/create-user'
import createSession from './modules/auth/middleware/create-session'
import removeSession from './modules/auth/middleware/remove-session'
import loadUser from './modules/auth/middleware/load-user'
import listBookmarks from './modules/bookmarks/middleware/list'
import createBookmark from './modules/bookmarks/middleware/create'
import bookmarkExists from './modules/bookmarks/middleware/exists'
import removeBookmark from './modules/bookmarks/middleware/remove'

const router = new Router()
const redis = getClient(config.get('redis.connection'))

router.get('/config', (ctx) => {
  const appConfig = config.get('wallaby')
  const host = config.get('wallaby.host')
  const basePath = config.get('wallaby.base_path')
  const baseUri = `${host}${basePath}`
  ctx.body = Object.assign({}, appConfig, { base_uri: baseUri })
})

router.get('/auth/github', initOauth(redis, config.get('auth.github.authorize_uri'), {
  client_id: config.get('auth.github.client_id'),
  redirect_uri: config.get('auth.github.redirect_uri'),
  scope: config.get('auth.github.scope')
}))

router.get('/auth/github/callback',
  getToken(redis, config.get('auth.github.token_uri'), {
    client_id: config.get('auth.github.client_id'),
    client_secret: config.get('auth.github.client_secret'),
    redirect_uri: config.get('auth.github.redirect_uri')
  }),
  lookupUser(config.get('auth.github.user_uri')),
  createUser(redis),
  createSession(redis),
  ctx => ctx.render('auth-success', {
    token: ctx.state.session.token,
    username: ctx.state.user.username,
    referer: ctx.state.auth.referer,
    provider: 'github'
  }))

router.put('/sessions',
  loadUser(redis),
  (ctx) => {
    const user = ctx.state.user || {}
    ctx.status = user.id ? 204 : 404
  })

router.delete('/sessions',
  loadUser(redis),
  removeSession(redis))

router.get('/bookmarks',
  loadUser(redis),
  listBookmarks(redis))

router.post('/bookmarks/:id',
  loadUser(redis),
  createBookmark(redis))

router.delete('/bookmarks/:id',
  loadUser(redis),
  bookmarkExists(redis),
  removeBookmark(redis))

export default router
