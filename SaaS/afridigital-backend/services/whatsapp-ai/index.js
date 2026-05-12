const { assertApiVersion } = require("../runtime/safety/api.guard");
const { routeMessage } = require("./router");

async function handleMessage(payload) {
  return await routeMessage(payload);
}

module.exports = { handleMessage };
