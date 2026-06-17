const { on } = require("../runtime/telemetry/afriscan.stream");

/**
 * 🧠 Converts backend events → graph nodes
 */
function bindGraphStream(wsServer) {

  on((event) => {
    const node = {
      id: Date.now(),
      type: event.type,
      payload: event.payload,
      ts: event.ts
    };

    const msg = JSON.stringify({
      topic: "AFRISCAN_NODE",
      node
    });

    wsServer.clients.forEach(c => {
      if (c.readyState === 1) c.send(msg);
    });
  });

  console.log("🧠 AFRISCAN GRAPH ADAPTER ACTIVE");
}

module.exports = { bindGraphStream };
