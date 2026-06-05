const { authorize } = require("../policy/engine");
const { logEvent } = require("../audit/ledger");

async function execute(command, user = { role: "user" }) {
  try {
    // 1. Normalize
    const normalized = {
      ...command,
      ts: Date.now(),
      source: command.source || "system"
    };

    // 2. Authorization gate
    authorize(user, "command:execute");

    // 3. Audit BEFORE execution (critical)
    await logEvent({
      type: "COMMAND_RECEIVED",
      payload: normalized,
      user: user.role
    });

    // 4. Forward execution
    return {
      status: "approved",
      command: normalized
    };

  } catch (err) {
    await logEvent({
      type: "COMMAND_BLOCKED",
      reason: err.message,
      command
    });

    return {
      status: "blocked",
      reason: err.message
    };
  }
}

module.exports = { execute };
