const DANGEROUS = [
  "rm -rf",
  "kill -9",
  "mkfs",
  ":(){",
  "shutdown",
  "reboot"
];

function commandPreview(command) {
  const lower = (command || "").toLowerCase();

  const risk = DANGEROUS.some(x => lower.includes(x))
    ? "HIGH"
    : lower.includes("pm2") || lower.includes("node")
      ? "MEDIUM"
      : "LOW";

  return {
    command,
    risk,
    allowed: risk !== "HIGH",
    note: risk === "HIGH"
      ? "Blocked unsafe operation"
      : "Safe to inspect (not executed)"
  };
}

module.exports = { commandPreview };
