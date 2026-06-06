/**
 * SELF-TRIGGERING BEHAVIOR ENGINE
 */

export function startSelfLoop(taskEngine, memory) {
  setInterval(() => {
    const last = memory.get("last_command");

    if (!last) return;

    // Example: auto-refresh system status
    if (last.cmd === "system_status") {
      taskEngine.add({
        action: "system_status",
        payload: {}
      });
    }

  }, 5000);
}
