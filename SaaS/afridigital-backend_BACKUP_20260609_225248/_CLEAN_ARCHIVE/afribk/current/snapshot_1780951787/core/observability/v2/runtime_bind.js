const attachGraph = require('./connector');

module.exports = function bindObservabilityGraph(obs) {

  // connect graph engine to observability event stream
  attachGraph(obs);

  // enrich trace events into graph nodes
  if (obs?.on) {
    obs.on('http_request', (data) => {
      console.log("🧠 GRAPH NODE:", data.traceId, data.path);
    });
  }

  console.log("🚀 Observability Graph Runtime v2.2 ACTIVE");
};
