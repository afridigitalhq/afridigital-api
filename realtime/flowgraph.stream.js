const bus = require('../africore/runtime/event.bus');

function attachFlowStream(wss) {
  bus.onAny = function(event, payload) {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event, payload }));
      }
    });
  };

  console.log("🌐 FLOWGRAPH STREAM BRIDGE ACTIVE");
}

module.exports = { attachFlowStream };
