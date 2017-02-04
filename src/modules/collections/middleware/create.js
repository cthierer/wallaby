/**
 * @module wallaby/modules/bookmarks/middleware/create
 */

import Validator from '../../core/validator'
import UserValidator from '../../auth/user-validator'
import { userCollections, collectionMembers } from '../data-keys'
import { getCollectionName, getCollectionKey } from '../utils'

/**
 * Initialize middleware to create a new Collection _from a bookmark_.
 *
 * The generated middleware expects for the Bookmark ID to be specified
 * as a named parameter (`id`), and for the `user` object to be loaded on
 * the `ctx.state`.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 * @todo Decouple from bookmark creation endpoint.
 */
function initCreate(redis) {
  return async function createCollection(ctx, next) {
    const user = new UserValidator(ctx.state.user)
      .isComplete()
      .get()
    const bookmark = ctx.request.body || {}
    const meta = bookmark.meta || {}
    const bookmarkId = new Validator(ctx.params.id || bookmark.id).exists().get()
    const bookmarkTitle = new Validator(meta.title).isNotEmpty().get()

    const collectionTitle = getCollectionName(bookmarkTitle)
    const collectionKey = getCollectionKey(collectionTitle)

    redis.sadd(userCollections(user), collectionTitle)
    redis.sadd(collectionMembers(user, collectionKey), bookmarkId)

    return next
  }
}

export default initCreate
