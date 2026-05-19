const fs = require("fs");
const path = require("path");

const MODULES = path.join(process.cwd(), "modules");
const REGISTRY = path.join(process.cwd(), "modules-registry.json");

function loadRegistry() {
  if (!fs.existsSync(REGISTRY)) {
    return { active: [], missing: [], disabled: [] };
  }
  return JSON.parse(fs.readFileSync(REGISTRY, "utf-8"));
}

function getStatus(mod) {
  if (fs.existsSync(path.join(MODULES, mod))) return "OK";
  if (fs.existsSync(path.join(MODULES, "_" + mod))) return "DISABLED";
  return "MISSING";
}

/**
 * 🎯 CORE: UI CARD BUILDER
 */
function buildStatusCards() {
  const registry = loadRegistry();

  const allModules = [
    ...new Set([
      ...(registry.active || []),
      ...(registry.disabled || []).map(m => m.replace("_", "")),
      ...(registry.missing || [])
    ])
  ];

  const modules = allModules.map(mod => {
    const status = getStatus(mod);

    return {
      module: mod,
      status,
      state:
        status === "OK"
          ? "healthy"
          : status === "DISABLED"
          ? "paused"
          : "critical",
      icon:
        status === "OK" ? "🟢" :
        status === "DISABLED" ? "🟡" :
        "🔴"
    };
  });

  const summary = {
    total: modules.length,
    ok: modules.filter(m => m.status === "OK").length,
    disabled: modules.filter(m => m.status === "DISABLED").length,
    missing: modules.filter(m => m.status === "MISSING").length
  };

  return {
    type: "AFRICONTROL_STATUS_V2",
    version: "2.0",
    timestamp: Date.now(),
    system: {
      name: "AfriControl V2",
      health_score: Math.round((summary.ok / summary.total) * 100)
    },
    summary,
    modules,
    ui: {
      layout: "card-grid",
      theme: "dark-neon",
      render_hint: "whatsapp-dashboard-compatible"
    }
  };
}

function render(command) {
  if (command === "status") {
    return buildStatusCards();
  }

  return {
    error: "UNKNOWN_COMMAND",
    supported: ["status"]
  };
}

module.exports = { render };
