/**
 * @module wallaby/router
 */

import Router from 'koa-router'
import config from 'config'
import getClient from './modules/data/client'
import catchError from './modules/core/middleware/catch-error'
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
import listCollections from './modules/collections/middleware/list'
import createCollection from './modules/collections/middleware/create'

const router = new Router()
const redis = getClient(config.get('redis.connection'))

/* ****************************************************************************
 * Expose clint configuration
 * ****************************************************************************/

router.get('/config', (ctx) => {
  const appConfig = config.get('wallaby')
  const host = config.get('wallaby.host')
  const basePath = config.get('wallaby.base_path')
  const baseUri = `${host}${basePath}`
  ctx.body = Object.assign({}, appConfig, { base_uri: baseUri })
})

/* ****************************************************************************
 * Github Oauth handlers
 * ****************************************************************************/

// initialize
router.get('/auth/github', initOauth(redis, config.get('auth.github.authorize_uri'), {
  client_id: config.get('auth.github.client_id'),
  redirect_uri: config.get('auth.github.redirect_uri'),
  scope: config.get('auth.github.scope')
}))

// oauth callback
router.get('/auth/github/callback',
  getToken(redis, config.get('auth.github.token_uri'), {
    client_id: config.get('auth.github.client_id'),
    client_secret: config.get('auth.github.client_secret'),
    redirect_uri: config.get('auth.github.redirect_uri')
  }),
  lookupUser(config.get('auth.github.user_uri')),
  createUser(redis),
  createSession(redis, config.get('auth.timeout')),
  ctx => ctx.render('auth-success', {
    token: ctx.state.session.token,
    username: ctx.state.user.username,
    referer: ctx.state.auth.referer,
    provider: 'github'
  }))

/* ****************************************************************************
 * Application session management
 * ****************************************************************************/

// update session timeout (extend the session)
router.put('/sessions',
  loadUser(redis, config.get('auth.timeout')),
  (ctx) => {
    const user = ctx.state.user || {}
    ctx.status = user.id ? 204 : 404
  })

// logout
router.delete('/sessions',
  loadUser(redis, config.get('auth.timeout')),
  removeSession(redis))

/* ****************************************************************************
 * Bookmarks
 * ****************************************************************************/

// get all bookmarks (paginated)
router.get('/bookmarks',
  catchError(),
  loadUser(redis, config.get('auth.timeout')),
  listBookmarks(redis))

// create a new bookmark
router.post('/bookmarks/:id',
  catchError(),
  loadUser(redis, config.get('auth.timeout')),
  createBookmark(redis),
  createCollection(redis))

// delete an existing bookmark
router.delete('/bookmarks/:id',
  catchError(),
  loadUser(redis, config.get('auth.timeout')),
  bookmarkExists(redis),
  removeBookmark(redis))

/* ****************************************************************************
 * Collections
 * ****************************************************************************/

// get all collections
router.get('/collections',
  catchError(),
  loadUser(redis, config.get('auth.timeout')),
  listCollections(redis))

export default router
