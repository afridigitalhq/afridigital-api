const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log("[DEVOPS AI]", msg);
}

function scan(file) {
  const code = fs.readFileSync(file, "utf-8");

  if (code.includes("pm2")) {
    log("PM2 detected → marking unsafe");
  }

  if (/let\s+memory\s+=\s+require/.test(code)) {
    log("Memory redeclaration risk → flagging");
  }

  if (code.includes("mesh.boot is not a function")) {
    log("Mesh instability detected → fallback required");
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const f of files) {
    const full = path.join(dir, f.name);

    if (f.isDirectory()) walk(full);
    else if (f.name.endsWith(".js")) scan(full);
  }
}

function runDevOpsCheck() {
  log("Starting full system scan...");
  walk(process.cwd());
  log("Scan complete");
}

module.exports = { runDevOpsCheck };
