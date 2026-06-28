// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const path = require("path");

const BLOCKED_PATTERNS = [
  "event-engine",
  "event-spine",
  "kernel.spine",
  "ring",
  "vm"
];

function assertKernelBoundary(importPath) {
  const normalized = importPath.toLowerCase();

  for (const p of BLOCKED_PATTERNS) {
    if (normalized.includes(p)) {
      throw new Error(
        "[KERNEL BOUNDARY VIOLATION] Direct access blocked: " + importPath
      );
    }
  }

  return true;
}

module.exports = { assertKernelBoundary };
