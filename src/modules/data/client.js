
import bluebird from 'bluebird'
import redis from 'redis'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

function getClient(options) {
  return redis.createClient(options)
}

export default getClient
