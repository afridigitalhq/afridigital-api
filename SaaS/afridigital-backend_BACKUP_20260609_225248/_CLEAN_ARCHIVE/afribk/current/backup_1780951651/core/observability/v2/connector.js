const graph = require('./graph');

module.exports = function attachGraphRuntime(obs) {

  // Hook into all observability events
  if (obs?.on) {

    obs.on('http_request', (data) => {
      graph.addNode(data.traceId, 'http_request', data);
    });

    obs.on('request_seen', (data) => {
      graph.addNode(data.traceId, 'request_seen', data);
    });
  }

  console.log("🧠 v2 Graph connected to runtime events");
};
