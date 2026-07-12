const fs = require("fs");

function detectHeal(snapshot) {
  const issues = [];

  if (!snapshot) return { action: "NO_SNAPSHOT" };

  if (snapshot.meta.servicesMounted < 10) {
    issues.push("LOW_SERVICE_COUNT");
  }

  if (snapshot.registry.length !== snapshot.kernelReport.registered) {
    issues.push("REGISTRY_DRIFT");
  }

  return {
    ok: issues.length === 0,
    action: issues.length ? "HEAL_REQUIRED" : "OK",
    issues,
    mode: "KERNEL_CONTROLLED"
  };
}

module.exports = { detectHeal };
