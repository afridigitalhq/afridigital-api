const bus = require("../core/context.cjs");

function validate(event, payload) {
  if (!event) return false;
  if (payload && typeof payload !== "object") return false;
  return true;
}

module.exports = { validate };
