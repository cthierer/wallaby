/**
 * @module wallaby/modules/core/middleware/catch-error
 */

import { ValidationError } from '../validator'

/**
 * Initialize middleware to catch and handle errors thrown by subsequent
 * middleware handlers.
 * @returns {function} Middleware function.
 */
function initCatchError() {
  return async function catchError(ctx, next) {
    try {
      await next()
    } catch (err) {
      if (err instanceof ValidationError) {
        ctx.status = 400
        ctx.body = {
          code: err.code,
          field: err.field,
          value: err.value,
          messsage: err.message
        }
        return
      }

      ctx.status = 500
      ctx.body = {
        code: 'error.server',
        message: err.message
      }
    }
  }
}

export default initCatchError
