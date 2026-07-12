// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const FORBIDDEN = ["event-engine", "event-spine", "spine", "ring"];

function validateImport(path = "") {
  for (const f of FORBIDDEN) {
    if (path.includes(f)) {
      throw new Error(`⛔ KERNEL HARDENING VIOLATION: blocked import -> ${path}`);
    }
  }
  return true;
}

module.exports = { validateImport };
