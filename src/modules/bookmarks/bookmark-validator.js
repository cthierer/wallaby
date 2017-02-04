/**
 * @module wallaby/modules/bookmarks/bookmark-validator
 */

import SchemaValidator from '../core/schema-validator'
import schema from './schemas/bookmarks.json'

/**
 * Validate that an object is a Bookmark instance.
 * @class
 * @extends {SchemaValidator}
 */
class BookmarkValidator extends SchemaValidator {
  /**
   * @constructor
   * @param {object} value The value to validate.
   * @param {string} name The name of the field being validated.
   */
  constructor(value, field) {
    super(value, field, schema)
  }
}

export default BookmarkValidator
