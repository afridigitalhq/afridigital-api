const { emitter } = require("../stream/dagStreamEmitter");

/**
 * 🔴 LIVE DAG WS BROKER
 * Bridges canonical emitter → WebSocket layer
 */
function attachDagWsBroker(io) {
  console.log("🧠 DAG WS BROKER ACTIVE");

  emitter.on("dag:event", (event) => {
    io.emit("dag:event", event);
  });

  emitter.on("kernel:update", (event) => {
    io.emit("dag:event", event);
  });
}

module.exports = { attachDagWsBroker };
