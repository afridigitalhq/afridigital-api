const { bootstrapAfriAIStream } = require("../../../bootstrap/ws-integration/output/afriai-stream-bootstrap.cjs");
module.exports = function attachAfriAIStream(server, WebSocketServer) {
  if (!server || !WebSocketServer) return;

  const wss = new WebSocketServer({ server, path: "/ws/afriai" });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({
      type: "afriai-ui",
      status: "connected",
      mode: "stream-v1.1"
    }));

    ws.on("message", (msg) => {
      const input = msg.toString();

      ws.send(JSON.stringify({
        success: true,
        layer: "afriai-ui-v1.1",
        intent: "STREAM_CHAT",
        reply: "processed",
        input,
        ts: Date.now()
      }));
    });
  });

  console.log("🧠 AfriAI UI Stream mounted → /ws/afriai");
};


bootstrapAfriAIStream(module.exports);
