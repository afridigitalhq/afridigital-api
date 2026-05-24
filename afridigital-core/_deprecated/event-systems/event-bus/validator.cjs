const registry = require("./registry.cjs");

function validate(type, payload) {
  const schema = registry[type];

  if (!schema) {
    throw new Error(`❌ UNREGISTERED EVENT: ${type}`);
  }

  for (const field of schema.required) {
    if (!(field in payload)) {
      throw new Error(`❌ INVALID EVENT PAYLOAD: missing ${field}`);
    }
  }

  return true;
}

module.exports = { validate };
