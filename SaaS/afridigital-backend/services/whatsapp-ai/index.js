const { routeMessage } = require("./router");

async function handleMessage(payload) {
  return await routeMessage(payload);
}

module.exports = { handleMessage };
