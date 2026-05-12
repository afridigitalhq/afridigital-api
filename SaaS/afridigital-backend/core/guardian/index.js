const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require("fs");
const path = require("path");

function scanFile(file) {
  const content = fs.readFileSync(file, "utf-8");

  if (content.includes("pm2")) {
    console.log("⚠️ PM2 detected:", file);
  }

  if (/let\s+memory\s+=\s+require/.test(content)) {
    console.log("⚠️ Memory redeclaration risk:", file);
  }

  if (content.includes("mesh.boot is not a function")) {
    console.log("⚠️ Mesh instability risk detected");
  }
}

function scanProject(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach(f => {
    const full = path.join(dir, f.name);

    if (f.isDirectory()) return scanProject(full);
    if (f.name.endsWith(".js")) scanFile(full);
  });
}

function bootGuard() {
  console.log("🛡️ Crash Guardian scanning system...");
  scanProject(process.cwd());
  console.log("✅ Guardian scan complete");
}

module.exports = { bootGuard };
