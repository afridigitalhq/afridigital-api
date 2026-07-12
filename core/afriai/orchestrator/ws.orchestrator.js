const fs = require("fs");

function loadSnapshot() {
  try {
    return JSON.parse(
      fs.readFileSync("./snapshots/ws/ws.snapshot.json","utf8")
    );
  } catch (e) {
    return null;
  }
}

function analyze(snapshot) {
  if (!snapshot) {
    return {
      ok: false,
      issue: "NO_SNAPSHOT_FOUND"
    };
  }

  const issues = [];

  if (snapshot.meta.servicesMounted !== snapshot.kernelReport.registered) {
    issues.push("REGISTRY_MISMATCH");
  }

  if (snapshot.registry.length > 20) {
    issues.push("POTENTIAL_DUPLICATES");
  }

  return {
    ok: issues.length === 0,
    issues,
    scanned: snapshot.kernelReport.scanned,
    registered: snapshot.kernelReport.registered
  };
}

function runWSOrchestrator() {
  const snapshot = loadSnapshot();
  const report = analyze(snapshot);

  const decision = {
    timestamp: Date.now(),
    report,
    action: report.ok ? "NO_ACTION" : "HEAL_RECOMMENDED",
    mode: "SAFE_ORCHESTRATOR"
  };

  return decision;
}

module.exports = { runWSOrchestrator };
