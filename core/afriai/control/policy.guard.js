const POLICY = {
  canSpawnPlugin: true,
  canUnloadPlugin: true,
  canStartPlugin: true,

  canModifyKernel: false,
  canEditServer: false,
  canAccessFS: false,

  maxEventsPerSecond: 100,
  mode: "CONTROLLED_ORCHESTRATION"
};

function validate(command) {
  if (!command || !command.action) {
    return { ok: false, reason: "INVALID_COMMAND" };
  }

  if (["KERNEL_PATCH", "CODE_MUTATION", "FS_WRITE"].includes(command.action)) {
    return { ok: false, reason: "BLOCKED_BY_POLICY" };
  }

  return { ok: true };
}

module.exports = { POLICY, validate };
