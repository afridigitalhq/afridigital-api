import AfriDebugIntegrationIntakeRuntime from "../../../../../src/afridebug/platform/integration/intake/AfriDebugIntegrationIntakeRuntime.js";

export function validateIntake() {
  const health = AfriDebugIntegrationIntakeRuntime.health();
  const stats = AfriDebugIntegrationIntakeRuntime.stats();

  const valid =
    health?.status === "healthy" &&
    typeof stats?.events === "number";

  return {
    component: "Intake",
    status: valid ? "PASSED" : "FAILED",
    events: stats?.events ?? 0,
    runtime: health?.service ?? "UNKNOWN",
    timestamp: new Date().toISOString()
  };
}
