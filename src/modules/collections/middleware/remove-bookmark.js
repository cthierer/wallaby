/**
 * @module wallaby/modules/collections/middleware/remove-bookmark
 */

import Promise from 'bluebird'
import Validator from '../../core/validator'
import UserValidator from '../../auth/user-validator'
import { userCollections, collectionMembers } from '../data-keys'
import { getCollectionKey } from '../utils'

/**
 * Initialize middleware to remove a Bookmark from a Collection.
 *
 * The generated middleware expects for the Bookmark ID to be specified
 * as a named parameter (`id`), and for the `user` object to be loaded on
 * the `ctx.state`.
 *
 * @param {object} redis Initialized Redis client.
 * @returns {function} The middleware function.
 * @todo Operations here should be tied into a transaction w/ previous mw
 * @todo Decouple from bookmark creation endpoint.
 */
function initRemoveBookmark(redis) {
  return async function removeBookmark(ctx) {
    const id = new Validator(ctx.params.id, 'id').exists().get()
    const user = new UserValidator(ctx.state.user, 'user').isComplete().get()

    const collections = await redis.smembersAsync(userCollections(user))

    await Promise.each(collections, collection =>
      redis.sremAsync(collectionMembers(user, getCollectionKey(collection)), id))
  }
}

export default initRemoveBookmark
