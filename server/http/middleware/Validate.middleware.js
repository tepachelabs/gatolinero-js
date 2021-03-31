const joi = require('joi');

class ValidateError extends Error {
  constructor(message, prop) {
    super(message);
    this.prop = prop;
    this.message = message;
    this.stack = (new Error()).stack;
  }
}

function validateType(object = {}, label, schema, options) {
  if (!schema) {
    return {};
  }
  let goodSchema;
  if (joi.isSchema(schema)) {
    goodSchema = schema;
  } else {
    goodSchema = joi.object(schema);
  }
  const { error, value } = goodSchema.validate(object, options);
  if (error) {
    throw new ValidateError(error.message, label);
  }
  return value;
}

/**
 * Generates a simple Joi Validator
 * @param {Object} validateObject
 * @param {Object} validateObject.headers Context headers
 * @param {Object} validateObject.params Parameters
 * @param {Object} validateObject.query Query params
 * @param {Object} validateObject.body Request Body
 * @returns Middleware function
 */
module.exports = function validate(validateObject, options = {}) {
  return function onReturn(ctx, next) {
    try {
      if (ctx.headers && validateObject.headers) {
        ctx.headers = validateType(ctx.headers, 'Headers', validateObject.headers, { ...options, allowUnknown: true });
      }
      if (ctx.params && validateObject.params) {
        ctx.params = validateType(ctx.params, 'Url Params', validateObject.params, options);
      }
      if (ctx.query) {
        if (validateObject.query) {
          ctx.query = validateType(ctx.query, 'Query Params', validateObject.query, { ...options, allowUnknown: true });
        }
      }
      if (ctx.request.body && validateObject.body) {
        ctx.request.body = validateType(ctx.request.body, 'Request Body', validateObject.body, options);
      }
      return next();
    } catch (error) {
      return ctx.badRequest({
        type: 'Validation/ValidationError',
        in: error.prop,
        message: error.message,
      });
    }
  };
};
