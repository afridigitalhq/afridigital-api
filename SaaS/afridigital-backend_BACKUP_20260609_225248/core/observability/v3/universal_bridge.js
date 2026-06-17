const graph = require('../v2/graph');

module.exports = function attachUniversalGraph(obs, workers, queues) {

  // HTTP layer
  if (obs?.on) {
    obs.on('http_request', (d) => {
      graph.addNode(d.traceId, 'http', d);
    });

    obs.on('request_seen', (d) => {
      graph.addNode(d.traceId, 'request', d);
    });
  }

  // Worker layer
  if (workers?.on) {
    workers.on('job_start', (d) => {
      graph.addNode(d.traceId, 'worker_start', d);
    });

    workers.on('job_done', (d) => {
      graph.addNode(d.traceId, 'worker_done', d);
    });
  }

  // Queue layer
  if (queues?.on) {
    queues.on('enqueue', (d) => {
      graph.addNode(d.traceId, 'queue_enqueue', d);
    });

    queues.on('dequeue', (d) => {
      graph.addNode(d.traceId, 'queue_dequeue', d);
    });
  }

  console.log("🌐 Universal Graph Intelligence v3.0 ACTIVE");
};
