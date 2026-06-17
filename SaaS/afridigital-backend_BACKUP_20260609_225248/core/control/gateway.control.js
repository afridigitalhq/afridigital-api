/**
 * 🧱 CONTROL GATEWAY (SAFE EXECUTION LAYER)
 * ALL system actions MUST pass here
 */

const allowedCommands = [
  "STATUS",
  "HEALTH_CHECK"
];

function validateCommand(cmd) {
  if (!cmd || !cmd.action) {
    return { allowed: false, reason: "Invalid command" };
  }

  if (!allowedCommands.includes(cmd.action)) {
    return { allowed: false, reason: "Command blocked by gateway" };
  }

  return { allowed: true };
}

async function executeSafeCommand(cmd) {
  const check = validateCommand(cmd);

  if (!check.allowed) {
    return {
      ok: false,
      output: "🚫 BLOCKED BY CONTROL GATEWAY: " + check.reason
    };
  }

  switch (cmd.action) {
    case "STATUS":
      return { ok: true, output: "🟢 System operational (gateway-safe mode)" };

    case "HEALTH_CHECK":
      return { ok: true, output: "🧠 Health OK (simulated safe check)" };

    default:
      return { ok: false, output: "Unknown safe action" };
  }
}

module.exports = {
  executeSafeCommand,
  validateCommand
};
