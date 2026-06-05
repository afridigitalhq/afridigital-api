const normalize = require("./normalize");
const detectIntent = require("./intent");
const route = require("./router");

function runPipeline(req) {
  const msg = normalize(req);
  const intent = detectIntent(msg.text);
  const flow = route(intent);

  return { message: msg, intent, flow };
}

module.exports = { runPipeline };
