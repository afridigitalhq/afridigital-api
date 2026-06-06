/**
 * Converts natural language → OS commands
 */

export function parseIntent(text = "") {
  const t = text.toLowerCase();

  // OPEN ACTIONS
  if (t.includes("open logs")) return { cmd: "open_logs" };
  if (t.includes("open flowgraph")) return { cmd: "open_flowgraph" };

  // CLOSE ACTIONS
  if (t.includes("close logs")) return { cmd: "close_window", payload: "logs" };
  if (t.includes("close flowgraph")) return { cmd: "close_window", payload: "flowgraph" };

  // SYSTEM
  if (t.includes("system status")) return { cmd: "system_status" };

  return { cmd: "unknown", raw: text };
}
