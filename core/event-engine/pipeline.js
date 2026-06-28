const { addCluster } = require("./enrich/cluster");
const { addPhysics } = require("./enrich/physics");
const { addCausal } = require("./enrich/causal");
const { broadcast } = require("../realtime/ws/stream.bridge");

function processEvent(event) {
  let e = addCluster(event);
  e = addPhysics(e);
  e = addCausal(e);

  broadcast(e);
  return e;
}

module.exports = { processEvent };
