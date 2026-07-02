const { bootstrapFlowgraph } = require("../../bootstrap/ws-integration/output/flowgraph-bootstrap");
/**
 * 🌐 WebSocket Bridge for FlowGraph UI
 */

const WebSocket = require("ws");
const { subscribe } = require("../ui/flowgraph-stream");

function initFlowGraphWS(server) {

  const wss = null /* DISABLED_BY_WS_KERNEL */;

  wss.on("connection", (ws) => {

    subscribe((data) => {
      ws.send(JSON.stringify(data));
    });

    ws.send(JSON.stringify({
      type: "CONNECTED",
      message: "FlowGraph Live Stream Active"
    }));
  });

  console.log("🌐 FlowGraph WebSocket Bridge ACTIVE");
}

bootstrapFlowgraph(module.exports);

module.exports = {
  initFlowGraphWS
};
