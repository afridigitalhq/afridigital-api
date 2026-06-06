/**
 * 🌐 WebSocket Bridge for FlowGraph UI
 */

const WebSocket = require("ws");
const { subscribe } = require("../ui/flowgraph-stream");

function initFlowGraphWS(server) {

  const wss = new WebSocket.Server({ server });

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

module.exports = {
  initFlowGraphWS
};
