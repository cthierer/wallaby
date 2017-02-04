/**
 * @module wallaby/modules/auth/user-validator
 */

import Validator from '../core/validator'

/**
 * Validate a User object. User objects are epxected to have ID and provider
 * attributes.
 * @class
 * @extends {Validator}
 */
class UserValidator extends Validator {
  /**
   * @constructor
   * @param {object} value The value to validate.
   * @param {string} name The name of the field being validated.
   */
  constructor(value, field) {
    super(value, field)
    this._id = new Validator((value || {}).id, 'id')
    this._provider = new Validator((value || {}).provider, 'provider')
  }

  /**
   * Check that the user object is valid.
   * @returns {UserValidator} Refeerence to this instance (for chaining).
   * @throws {ValidationError} If the object is invalid.
   */
  isComplete() {
    this.exists()
    this._id.exists()
    this._provider.exists()
    return this
  }
}

export default UserValidator
