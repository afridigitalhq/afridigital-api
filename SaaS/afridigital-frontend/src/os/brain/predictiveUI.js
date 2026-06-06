/**
 * PREDICTIVE UI ENGINE
 */

export function predictNextAction(memory) {
  const last = memory.get("last_command");

  if (!last) return null;

  if (last.cmd === "open_logs") {
    return { suggest: "open_flowgraph" };
  }

  if (last.cmd === "open_flowgraph") {
    return { suggest: "system_status" };
  }

  return null;
}
