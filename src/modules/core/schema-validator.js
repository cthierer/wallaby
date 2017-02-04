/**
 * @module wallaby/modules/core/schema-validator
 */

import tv4 from 'tv4'
import Validator, { ValidationError } from './validator'

/**
 * Signifiy that an value does not match the expected schema.
 * @type {string}
 */
const INVALID = 'schema.invalid'

/**
 * Validate that a data value matches the provided schema.
 * @class
 * @extends {Validator}
 */
class SchemaValidator extends Validator {
  /**
  * @constructor
  * @param {any} value The value to validate.
  * @param {string} name The name of the field being validated.
  * @param {string} schema The JSON schema to validate against.
  */
  constructor(value, field, schema) {
    super(value, field)
    this._schema = schema
  }

  /**
   * Check that the value matches the schema.
   * @returns {SchemaValidator} Reference to this instance (for chaining).
   * @throws {ValidationError} If the value is null or undefined.
   */
  matchesSchema() {
    const result = tv4.validateResult(this.value, this._schema)

    if (!result.valid) {
      const validationErr = result.error
      const err = new ValidationError(INVALID, this.field, this.value,
        `"${this.field}" does not match the expected schema: ${validationErr.dataPath}`)
      err.dataPath = validationErr.dataPath
      err.schemaPath = validationErr.schemaPath
      throw err
    }

    return this
  }
}

export default SchemaValidator
