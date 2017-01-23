/**
 * @module wallaby/modules/data/client
 */

import bluebird from 'bluebird'
import redis from 'redis'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

/**
 * Create a Redis client.
 * @param {object} [options] Options to initialize the client.
 * @returns {object} The initialized Redis client. The client has been
 *  Promise-ified to allow operations using Promise syntax.
 */
function getClient(options) {
  return redis.createClient(options)
}

export default getClient
