/**
 * Football Streaming Plugin
 * consumes DAG events and streams updates
 */

function footballWorker(node, context) {
  return {
    node,
    type: "football",
    stream: true,
    data: {
      matchId: context.matchId || "live",
      status: "processing",
      payload: context
    }
  };
}

module.exports = footballWorker;
