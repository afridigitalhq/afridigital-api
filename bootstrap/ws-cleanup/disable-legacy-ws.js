const fs = require("fs");

const targets = [
  "core/afriai/ws/afriai.ws.js",
  "core/afriai/ws/afriai.stream.js",
  "core/realtime/ws/stream.bridge.cjs",
  "core/realtime/flowgraph-ws.js",
  "core/realtime/ws/stream.bridge.cjs",
  "core/realtime/ws/stream.bridge.backup.js",
  "core/realtime/ws/stream.bridge.backup.stable.js"
];

function disable(file) {
  if (!fs.existsSync(file)) return;

  let s = fs.readFileSync(file, "utf8");

  // neutralize WebSocket server creation
  s = s.replace(/new WebSocket\.Server\([^)]*\)/g, "null /* DISABLED_BY_WS_KERNEL */");

  // disable init functions
  s = s.replace(/function initWS/g, "function initWS_DISABLED");

  // disable exports that auto-run servers
  s = s.replace(/module\.exports\s*=\s*initWS/g, "module.exports = function(){ return null }");

  fs.writeFileSync(file, s);
  console.log("🟡 DISABLED:", file);
}

targets.forEach(disable);

console.log("🧠 LEGACY WS SERVERS NEUTRALIZED");
