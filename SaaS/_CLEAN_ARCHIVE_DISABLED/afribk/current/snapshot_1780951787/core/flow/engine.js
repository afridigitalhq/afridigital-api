const { publish } = require("./mesh/eventBus");

const nodes = ["API", "Kernel", "EventBus", "AI Brain", "Database"];
let i = 0;

function emitFlowEvent(userId = "system") {
const { routeNext } = require("./attention/routingEngine");
const { registerSynapse } = require("./synapse/edgeEngine");
const { injectHeat } = require("./physics/heatEngine");
  const node = routeNext();

  const event = {
    id: "evt_" + Date.now(),
    userId,
    node,
    action: "execute",
    cpu: Math.random(),
    memory: Math.random(),
    timestamp: Date.now()
  };

  publish("flowgraph:event", event);
injectHeat(node, 1);
injectHeat(node, 0.3);
  try { registerSynapse("Kernel", node); } catch(e) {}
const { injectHeat } = require("./physics/heatEngine");

  return event;
}

module.exports = { emitFlowEvent };
const { routeNext } = require("./attention/routingEngine");
const { registerSynapse } = require("./synapse/edgeEngine");
const { injectHeat } = require("./physics/heatEngine");
