const fs = require("fs");

const OUT = "bootstrap/ws-v2/output";
fs.mkdirSync(OUT, { recursive: true });

console.log("🧠 AFRIKERNEL WS V2 BUILDER START");

// ===============================
// 1. Gateway
// ===============================
fs.writeFileSync(`${OUT}/ws-gateway.js`, `
const WebSocket = require("ws");

function createWSGateway(server, kernel) {
  const wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "ws.connected", ok: true }));

    ws.on("message", (msg) => {
      let event;
      try { event = JSON.parse(msg); } catch(e) { return; }

      const result = kernel?.core?.dispatch
        ? kernel.core.dispatch(event)
        : { ok: false, error: "NO_KERNEL" };

      ws.send(JSON.stringify({ type: "ws.response", result }));
    });
  });

  return wss;
}

module.exports = { createWSGateway };
`);

// ===============================
// 2. AfriAI Channel
// ===============================
fs.writeFileSync(`${OUT}/ws-afriai-channel.js`, `
function afriaiChannel(ws, kernel) {
  return (event) => {
    const result = kernel.core.dispatch({
      type: "AFRIAI_EVENT",
      payload: event
    });

    ws.send(JSON.stringify({
      type: "afriai.stream",
      result
    }));
  };
}

module.exports = { afriaiChannel };
`);

// ===============================
// 3. Heartbeat
// ===============================
fs.writeFileSync(`${OUT}/ws-heartbeat.js`, `
function createHeartbeat(ws) {
  return setInterval(() => {
    ws.send(JSON.stringify({
      type: "heartbeat",
      ts: Date.now()
    }));
  }, 5000);
}

module.exports = { createHeartbeat };
`);

// ===============================
// 4. Router
// ===============================
fs.writeFileSync(`${OUT}/ws-router.js`, `
function routeWSMessage(msg, handlers = {}) {
  if (handlers[msg.type]) return handlers[msg.type](msg);
  return { ok: false, error: "NO_HANDLER" };
}

module.exports = { routeWSMessage };
`);

console.log("🟢 WS V2 BUILD COMPLETE");
console.log("📦 OUTPUT READY:", OUT);
