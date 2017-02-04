/**
 * @module wallaby/modules/core/validator
 */

/**
 * Code for if a value does not exist (is null or undefined).
 * @type {string}
 */
const NON_EXISTENT = 'filter.does_not_exist'

/**
 * Code for if a value was expected to be a number, but is not.
 * @type {string}
 */
const NOT_NUMBER = 'filter.not_a_number'

/**
 * Code for if a value was expected to be positive, but it is not.
 * @type {string}
 */
const NOT_POSITIVE = 'filter.not_positive'

/**
 * Code for if a value was expected to be a non-zero value, but it is not.
 * @type {string}
 */
const NOT_ZERO = 'filter.not_zero'

/**
 * Code for if a value was expected to be found in a set, but was not.
 * @type {string}
 */
const NOT_IN_SET = 'filter.not_in_set'

/**
 * Code for if a value was expected to be not-empty, but was empty.
 * @type {string}
 */
const EMPTY = 'filter.empty'

/**
 * Encapsulates a validation error, which occurs when a user input field does
 * not match an expected value.
 * @class
 * @todo Move into a separate file.
 */
class ValidationError extends Error {
  /**
   * @constructor
   * @param {string} code The unique identifier for this error.
   * @param {string} field The name of the field being validated.
   * @param {any} value The value being validated.
   * @param {string} message A human-friendly validation message.
   */
  constructor(code, field, value, message) {
    super(message)
    this.code = code
    this.field = field
    this.value = value
  }
}

/**
 * Handle validating a value. Methods in this class can be chained together.
 * When a value fails a validation rule, an exception is thrown with details
 * about the failure.
 *
 * @example
 * const validator = new Validator(myVal, 'field')
 * try {
 *   const value = validator.isNumber().get()
 * } catch (e) {
 *   if (e instanceof ValidationError) {
 *     // handle validation failure
 *   } else {
 *     // something else happened...
 *   }
 * }
 * @class
 * @todo Move into a core module.
 */
class Validator {
  /**
   * @constructor
   * @param {any} value The value to validate.
   * @param {string} name The name of the field being validated.
   */
  constructor(value, field) {
    this.value = value
    this.field = field
  }

  /**
   * @returns {any} The value being validated.
   */
  get() {
    return this.value
  }

  /**
   * Check that a valud is not null and not undefined.
   * @returns {Validator} Reference to this instance (for chaining).
   * @throws {ValidationError} If the value is null or undefined.
   */
  exists() {
    if (typeof this.value === 'undefined' || this.value === null) {
      throw new ValidationError(NON_EXISTENT, this.field, this.value,
        `"${this.field}" must be defined`)
    }

    return this
  }

  /**
   * Check if the value is a non-empty string.
   * @returns {Validator} Reference to this instance (for chainig).
   * @throws {ValidationError} If the value is empty.
   */
  isNotEmpty() {
    if (typeof this.value === 'string' && this.value.trim().length < 1) {
      throw new ValidationError(EMPTY, this.field, this.value,
        `"${this.field}" must not be an empty string`)
    } else if (!this.value) {
      throw new ValidationError(EMPTY, this.field, this.value,
        `"${this.field}" must not be empty`)
    }

    return this
  }

  /**
   * Check if the value is a number, and is not NaN.
   * @returns {Validator} Reference to this instance (for chaining).
   * @throws {ValidationError} If the value is not a number.
   */
  isNumber() {
    if ((typeof this.value !== 'number') || Number.isNaN(this.value)) {
      throw new ValidationError(NOT_NUMBER, this.field, this.value,
        `"${this.field}" must be a number`)
    }

    return this
  }

  /**
   * Check if the value is positive or zero.
   * @returns {Validator} Reference to this instance (for chaining).
   * @throws {ValidationError} If the value is negative.
   */
  isPositiveOrZero() {
    if (this.value < 0) {
      throw new ValidationError(NOT_POSITIVE, this.field, this.value,
        `"${this.field}" must be greater than or equal to 0`)
    }

    return this
  }

  /**
   * Check if the value is positive and not zero.
   * @returns {Validator} Reference to this instance (for chaining).
   * @throws {ValidationError} If the value is negative or zero.
   */
  isPositive() {
    if (this.value < 0) {
      throw new ValidationError(NOT_POSITIVE, this.field, this.value,
        `"${this.field}" must be greater than 0`)
    } else if (this.value === 0) {
      throw new ValidationError(NOT_ZERO, this.field, this.value,
        `"${this.field}" must not be 0`)
    }

    return this
  }

  /**
   * Check if the value is in the provided collection.
   * @returns {Validator} Reference to this instance (for chaining).
   * @throws {ValidationError} If the value is not in the provided set of
   *  legal values.
   */
  isOneOf(legalValues) {
    const match = legalValues.find(value => value === this.value)

    if (!match) {
      throw new ValidationError(NOT_IN_SET, this.field, this.value,
        `"${this.field}" must be one of: ${legalValues.join()}`)
    }

    return this
  }
}

export default Validator
export { ValidationError }
