const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MODULES = path.join(ROOT, "modules");
const REGISTRY_FILE = path.join(ROOT, "modules-registry.json");

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_FILE)) {
    return { active: [], missing: [], disabled: [] };
  }
  return JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf-8"));
}

function checkModule(mod) {
  const active = fs.existsSync(path.join(MODULES, mod));
  const disabled = fs.existsSync(path.join(MODULES, "_" + mod));

  if (active) return "OK";
  if (disabled) return "DISABLED";
  return "MISSING";
}

function buildStatus() {
  const registry = loadRegistry();
  const all = [
    ...new Set([
      ...registry.active,
      ...registry.disabled.map(m => m.replace("_", "")),
      ...(registry.missing || [])
    ])
  ];

  const report = all.map(mod => {
    const status = checkModule(mod);

    if (status === "OK") return `✅ ${mod} OK`;
    if (status === "DISABLED") return `⚠️ ${mod} DISABLED`;
    return `❌ ${mod} MISSING`;
  });

  return {
    system: "AfriControl V2",
    health: {
      total: all.length,
      ok: report.filter(r => r.startsWith("✅")).length,
      disabled: report.filter(r => r.startsWith("⚠️")).length,
      missing: report.filter(r => r.startsWith("❌")).length
    },
    report
  };
}

function execute(command) {
  if (command === "status") {
    return buildStatus();
  }

  return {
    error: "UNKNOWN_COMMAND",
    supported: ["status"]
  };
}

module.exports = { execute };
