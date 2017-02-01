/* eslint-env browser */

import riot from 'riot/riot'
import moment from 'moment'
import initCore from './modules/core/tags/init'
import getClient from './wallaby'

// load Riot global
window.riot = riot

/**
 * Show an application notification in the UI.
 * @param {string} type The type of notification; should be either "error" or
 *  "info".
 * @param {string} message The message to include in the notification.
 * @param {DOMElement} [mountPoint=body] The point in the DOM to mount the
 *  notification.
 */
function notify(type, message, mountPoint = document.body) {
  // create a mount point for the element
  // the Riot tag actually positions and styles the notification, but Riot
  // tags need to be mounted to an element
  // the element is forcefully unmounted when the notification is closed, so
  // this needs to be a disposable element.
  const notifyElement = document.createElement('div')

  notifyElement.style.position = 'absolute'
  notifyElement.style.width = 0
  notifyElement.style.height = 0
  notifyElement.style.overflow = 'hidden'

  mountPoint.appendChild(notifyElement)

  // show the notification tag
  riot.mount(notifyElement, 'core-notification', { type, message })
}

/**
 * Load the wallaby toolbar into the reader's toolbar.
 * @param {object} api The application API.
 * @param {object} api.state The application state object.
 * @param {object} api.config The application configuration object.
 * @returns {array} Collection of DOM elements where the Riot tags were mounted.
 * @todo Make mountpoint more configurable.
 * @todo Mount toolbar to fallback location.
 */
function loadToolbar(api) {
  // find the toolbar in the existing reader
  const footer = document.getElementById('footer')
  const nav = footer ? footer.getElementsByTagName('nav') : null
  const actions = nav && nav.length ? nav[0].getElementsByTagName('ul') : null
  const actionList = actions && actions.length ? actions[0] : null

  if (actionList) {
    // found the toolbar, now mount the wallaby compontents to add to it
    const appAction = document.createElement('li')

    appAction.style.textIndent = 0
    actionList.appendChild(appAction)
    actionList.style.width = `${actionList.clientWidth + 55}px`

    // mount the Riot tag
    return riot.mount(appAction, 'wallaby-bookmark-button', api)
  }

  // no toolbar found - do nothing
  return []
}

getClient('API_CONFIG_URL')
  .then(async (client) => {
    const initialState = await client.loadStateString(localStorage.getItem('wallaby:state'))
    const config = client.config
    const state = riot.observable(initialState)
    const api = { state, config }

    state.config = config
    window.wallaby = { state, config }

    // handle the "destroy" event on the state
    // this is called when the user logs out, or a session expires
    state.on('destroy', () => {
      localStorage.removeItem('wallaby:state')
      Object.keys(state).forEach(key => delete state[key])
      state.trigger('update')
    })

    // whenever the state is updated, save the changes to local storage
    state.on('update', () => {
      localStorage.setItem('wallaby:state', JSON.stringify(state))
    })

    riot.mixin({ wallaby: client })
    riot.mixin({ notify })
    riot.mixin('moment', moment)

    await initCore(riot)

    // `window.rocket` is the JS application for reading comics
    // if it is found, assume we are in a comic, and load the toolbar
    // otherwise, just load any riot tags included on the page
    const tags = window.rocket ? loadToolbar(api) : riot.mount('*', api)

    // update the root tags whenever the state is updated
    state.on('update', () => tags.forEach(tag => tag.update()))
  }).then(() => {
    console.log('loaded wallaby') // eslint-disable-line no-console
  })
