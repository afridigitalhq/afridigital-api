const { z } = require("zod");

/**
 * 🛡️ TOOL INPUT VALIDATION
 */
function validate(schema, input) {
  const validator = z.object(schema);
  return validator.parse(input);
}

module.exports = { validate };
