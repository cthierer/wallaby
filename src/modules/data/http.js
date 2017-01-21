/**
 * @module redtail/modules/data/http
 */

import * as popsicle from 'popsicle'

/**
 * MIME type for JSON data.
 * @type {String}
 */
const CONTENT_TYPE_JSON = 'application/json'

/**
 * Make a generic HTTP request.
 * @param {object} options The request options, matching the options expected
 *  by the popsicle module.
 * @param {string} method The HTTP method to use; defaults to "GET".
 * @returns The response body on success.
 * @throws A generic error if the response status code indicates an error
 *  condition (400 or 500-class errors).
 * @todo Customize the error to be specific to an HTTP error.
 * @see https://github.com/blakeembrey/popsicle#handling-requests
 */
async function request(options, method = 'GET') {
  if (!options.url) {
    throw new Error('Missing required option: `url`')
  }

  return popsicle.request(Object.assign({}, options, {
    method,
    headers: Object.assign(options.headers || {}, { accept: CONTENT_TYPE_JSON })
  }))
    .use(popsicle.plugins.parse(['json']))
    .then((response) => {
      if (response.status >= 400) {
        const err = new Error(`Error retrieving data from remote: ${response.status}`)
        err.status = response.status
        err.body = response.body
        err.response = response
        throw err
      }
      return response.body
    })
}

/**
 * Retrieve JSON data from a remote HTTP service. Handles requesting JSON
 * data, and parsing the result into a Javascript object.
 * @param {Object} options The request options for making the HTTP request.
 *  Should match the format expected by the popsicle module.
 * @returns {Object} The response body on success, formatted as JSON.
 * @see https://github.com/blakeembrey/popsicle#handling-requests
 */
async function getDataAsJSON(options) {
  return request(options)
}

/**
 * Make a PUT request, submitting the body to the endpoint specified by the
 * options object.
 * @param {Object} body The body to PUT to the remote service.
 * @param {Object} options The request options for making the HTTP request.
 *  Should match the format expected by the popsicle module.
 * @returns {Object} The response body on success, formatted as JSON.
 * @see https://github.com/blakeembrey/popsicle#handling-requests
 */
async function putDataAsJSON(body, options) {
  return request(Object.assign({}, options, { body }), 'PUT')
}

/**
 * Make a POST request, submitting the body to the endpoint specified by the
 * options object.
 * @param {Object} body The body to POST to the remote service.
 * @param {Object} options The request options for making the HTTP request.
 *  Should match the format expected by the popsicle module.
 * @returns {Object} The response body on success, formatted as JSON.
 * @see https://github.com/blakeembrey/popsicle#handling-requests
 */
async function postDataAsJSON(body, options) {
  return request(Object.assign({}, options, { body }), 'POST')
}

/**
 * Make a DELETE request to the endpoint specified by the options object.
 * @param {Object} options The request options for making the HTTP request.
 *  Should match the format expected by the popsicle module.
 * @returns {Object} The response body on success, formatted as JSON.
 * @see https://github.com/blakeembrey/popsicle#handling-requests
 */
async function deleteData(options) {
  return request(options, 'DELETE')
}

export default popsicle
export { getDataAsJSON, putDataAsJSON, postDataAsJSON, deleteData }
