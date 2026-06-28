// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
/**
 * SYSCALLGATE RUNTIME GUARD
 * Hard fail enforcement layer
 */

const fs = require("fs");
const path = require("path");

function assertSyscallGateIntegrity() {
  const matches = require("child_process")
    .execSync("grep -R 'SyscallGate' core/kernel/syscall 2>/dev/null || true")
    .toString()
    .trim()
    .split("\n")
    .filter(Boolean);

  if (matches.length === 0) {
    throw new Error("SYSCTALLGATE GUARD: ENTRYPOINT MISSING");
  }

  const uniqueFiles = new Set(matches.map(m => m.split(":")[0]));

  if (uniqueFiles.size > 1) {
    throw new Error("SYSCTALLGATE GUARD: MULTIPLE ENTRYPOINTS DETECTED");
  }

  return true;
}

module.exports = { assertSyscallGateIntegrity };
