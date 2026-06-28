module.exports = function attachAfriAIWebSocket(server, WebSocketServer) {
  if (!server || !WebSocketServer) return;

  const wss = new WebSocketServer({ server, path: "/ws/afriai" });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "afriai", status: "connected" }));

    ws.on("message", (msg) => {
      ws.send(JSON.stringify({
        type: "afriai-response",
        input: msg.toString(),
        reply: "AfriAI v1 read-only active"
      }));
    });
  });

  console.log("🧠 AfriAI WS mounted → /ws/afriai");
};
