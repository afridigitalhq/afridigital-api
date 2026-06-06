/**
 * BACKGROUND AGENTS (always running OS workers)
 */

export function startBackgroundAgents(orchestrator) {
  // Agent 1: system heartbeat
  setInterval(() => {
    orchestrator.execute("system_status");
  }, 15000);

  // Agent 2: UI cleanup / memory sync
  setInterval(() => {
    console.log("🧠 syncing UI state...");
  }, 20000);
}
