const fs = require("fs");

function patchCooldown() {
  const file = "./core/afriai/anomaly/ws.anomaly.engine.js";
  let s = fs.readFileSync(file, "utf8");

  if (s.includes("lastAlert")) {
    return { ok: true, skipped: true };
  }

  const injection = `
    this.lastAlert = 0;
    this.cooldownMs = 2000;
`;

  s = s.replace(
    "this.thresholds = {",
    injection + "\n    this.thresholds = {"
  );

  s = s.replace(
    "this.emit('anomaly', {",
    `
    const now = Date.now();
    if (now - this.lastAlert < this.cooldownMs) return;
    this.lastAlert = now;

    this.emit('anomaly', {
`
  );

  fs.writeFileSync(file, s);

  return {
    ok: true,
    patched: true
  };
}

module.exports = { patchCooldown };
