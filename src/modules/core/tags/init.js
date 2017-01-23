/**
 * @module wallaby/modules/core/tags/init
 */

import octicons from 'octicons'

/**
 * Initialize mixins and other dependencies for the Riot tags in this module.
 * @param {object} riot The Riot application.
 * @returns {Promise} Resolves when initialization is complete.
 */
function initTags(riot) {
  riot.mixin('icons', octicons)
  return Promise.resolve()
}

export default initTags
