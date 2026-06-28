const { parseIntent } = require("./intent.parser");
const { routeCommand } = require("./command.router");

function afriaiGateway(input, deps = {}) {
  const intent = parseIntent(input);

  const result = routeCommand(intent, input, {
    state: deps.state,
    events: deps.events,
    whatsapp: deps.whatsapp,
    topology: deps.topology
  });

  return {
    intent,
    result,
    timestamp: Date.now()
  };
}

module.exports = { afriaiGateway };
