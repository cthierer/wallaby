/**
 * @module wallaby/data
 */

import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
import semver from 'semver'

const readdirAsync = Promise.promisify(fs.readdir)

/**
 * Generate an array of database migration functions that must be applied
 * between the specified version `sinceVersion` and the current version of the
 * application.
 * @param {string} sinceVersion The semver version tag for the starting boundry.
 * @returns {function[]} Applicable migration functions.
 */
async function getMigrations(sinceVersion) {
  if (!sinceVersion || !semver.valid(sinceVersion)) {
    throw new TypeError(`invalid parameter: "${sinceVersion}" is not a valid version`)
  }

  const scripts = await readdirAsync(path.join(__dirname, './migrations'))
  const migrations = scripts
    .map(filename => require(`./migrations/${filename}`)) // eslint-disable-line
    .filter(script => semver.gte(script.APPLIES_TO_VERSION, sinceVersion))
    .map(script => script.default)

  return migrations
}

export {
  getMigrations // eslint-disable-line import/prefer-default-export
}
