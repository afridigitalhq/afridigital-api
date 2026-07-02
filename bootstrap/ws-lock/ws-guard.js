const fs = require("fs");

const forbiddenPatterns = [
  "new WebSocket.Server",
  "new WebSocketServer",
  "ws = new WebSocket",
  "new WS.Server"
];

function scanFile(file) {
  const content = fs.readFileSync(file, "utf8");

  for (const p of forbiddenPatterns) {
    if (content.includes(p)) {
      return { file, violation: p, blocked: true };
    }
  }

  return { file, blocked: false };
}

function scanTree(files) {
  const results = files.map(scanFile);
  const violations = results.filter(r => r.blocked);

  return {
    ok: violations.length === 0,
    scanned: results.length,
    violations
  };
}

module.exports = { scanTree };
