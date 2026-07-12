const fs = require("fs");

function injectObserver() {
  const file = "core/realtime/ws/stream.bridge.cjs";
  let s = fs.readFileSync(file, "utf8");

  if (!s.includes("ws.afriai.observer")) {
    s = s.replace(
      'const WebSocket = require("ws");',
      'const WebSocket = require("ws");\nconst observer = require("../../../core/afriai/observer/ws.afriai.observer");'
    );

    s = s.replace(
      'wss = new WebSocket.Server({ server });',
      'wss = new WebSocket.Server({ server });\n  wss.on("connection", (ws) => observer.connect());'
    );

    s = s.replace(
      'ws.on("message", (msg) => {',
      'ws.on("message", (msg) => {\n      observer.ingest(msg.toString());'
    );

    fs.writeFileSync(file, s);
  }

  return { ok: true, injected: true };
}

module.exports = { injectObserver };
