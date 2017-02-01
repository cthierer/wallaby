/**
 * @module wallaby/migrate
 */

import Promise from 'bluebird'
import config from 'config'
import getClient from './modules/data/client'
import { getMigrations } from './data'

const pkgVersion = process.env.npm_package_version || process.argv[2]
const redis = getClient(config.get('redis.connection'))

async function doMigrations() {
  const curVersion = await redis.getAsync('wallaby:app:version') || pkgVersion

  console.log(`applying database migrations for version >= ${curVersion}`) // eslint-disable-line no-console

  const migrations = await getMigrations(curVersion)
  await Promise.map(migrations, fn => fn(redis))
  await redis.setAsync('wallaby:app:version', pkgVersion)

  return migrations.length
}

doMigrations()
  .then((count) => {
    redis.quit()
    console.log(`success: applied ${count} script(s)`) // eslint-disable-line no-console
  })
  .catch((err) => {
    redis.quit()
    console.error(`problem migrating database: ${err.message}`, err) // eslint-disable-line no-console
    process.exitCode = -1
  })
