const { assertApiVersion } = require("./api.guard");

function enforce(url, context) {
  assertApiVersion(url, context);
  return url;
}

module.exports = { enforce };
