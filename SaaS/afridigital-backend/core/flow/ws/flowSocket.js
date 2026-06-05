const WebSocket = require("ws");

const nodes = ["API", "Kernel", "EventBus", "AI Brain", "Database"];
let i = 0;

function createFlowSocket(server) {
  const wss = new WebSocket.Server({ server, path: "/flow-stream" });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({
      type: "init",
      status: "connected",
      engine: "flowgraph"
    }));

    const interval = setInterval(() => {
      const node = nodes[i++ % nodes.length];

      ws.send(JSON.stringify({
        type: "flow:event",
        id: "evt_" + Date.now(),
        node,
        action: "execute",
        status: "running",
        timestamp: Date.now()
      }));
    }, 1500);

    ws.on("close", () => clearInterval(interval));
  });

  console.log("⚡ FlowGraph WS ready at /flow-stream");
}

module.exports = { createFlowSocket };
