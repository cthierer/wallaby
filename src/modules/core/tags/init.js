import octicons from 'octicons'

function initTags(riot) {
  riot.mixin('icons', octicons)
  return Promise.resolve()
}

export default initTags
