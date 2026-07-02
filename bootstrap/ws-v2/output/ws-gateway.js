const WebSocket = require("ws");

function createWSGateway(server, kernel) {
  const wss = new WebSocket.Server({ server, path: "/ws/afriai" });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({
      type: "ws.connected",
      ok: true,
      timestamp: Date.now()
    }));

    ws.on("message", (msg) => {
      let event;
      try { event = JSON.parse(msg); } catch (e) { return; }

      const result = kernel?.core?.dispatch
        ? kernel.core.dispatch(event)
        : { ok: false, error: "NO_KERNEL" };

      ws.send(JSON.stringify({
        type: "ws.response",
        result
      }));
    });

    const ping = setInterval(() => {
      ws.send(JSON.stringify({
        type: "ws.ping",
        ts: Date.now()
      }));
    }, 5000);

    ws.on("close", () => clearInterval(ping));
  });

  return wss;
}

module.exports = { createWSGateway };
