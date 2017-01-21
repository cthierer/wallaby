/* eslint-env browser */

import riot from 'riot/riot'
import initCore from './modules/core/tags/init'
import getClient from './wallaby'

window.riot = riot

console.log('loading wallaby') // eslint-disable-line no-console

function notify(type, message, mountPoint = document.body) {
  const notifyElement = document.createElement('div')

  notifyElement.style.position = 'absolute'
  notifyElement.style.width = 0
  notifyElement.style.height = 0
  notifyElement.style.overflow = 'hidden'

  mountPoint.appendChild(notifyElement)

  riot.mount(notifyElement, 'core-notification', { type, message })
}

function loadToolbar(api) {
  const footer = document.getElementById('footer')
  const nav = footer ? footer.getElementsByTagName('nav') : null
  const actions = nav && nav.length ? nav[0].getElementsByTagName('ul') : null
  const actionList = actions && actions.length ? actions[0] : null

  if (actionList) {
    const appAction = document.createElement('li')

    console.log('creating bookmark button') // eslint-disable-line no-console

    appAction.style.textIndent = 0
    actionList.appendChild(appAction)
    actionList.style.width = `${actionList.clientWidth + 55}px`

    return riot.mount(appAction, 'wallaby-bookmark-button', api)
  }

  return []
}

getClient('API_CONFIG_URL')
  .then(async (client) => {
    const initialState = await client.loadStateString(sessionStorage.getItem('wallaby:state'))
    const config = client.config
    const state = riot.observable(initialState)
    const api = { state, config }

    state.config = config
    window.wallaby = { state, config }

    state.on('destroy', () => {
      sessionStorage.removeItem('wallaby:state')
      Object.keys(state).forEach(key => delete state[key])
      state.trigger('update')
    })

    state.on('update', () => {
      sessionStorage.setItem('wallaby:state', JSON.stringify(state))
    })

    riot.mixin({ wallaby: client })
    riot.mixin({ notify })

    await initCore(riot)

    const tags = window.rocket ? loadToolbar(api) : riot.mount('*', api)

    state.on('update', () => tags.forEach(tag => tag.update()))
  }).then(() => {
    console.log('done loading!') // eslint-disable-line no-console
  })
