// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
/**
 * PREVENTS SYSTEM SPRAWL
 * Blocks creation of new execution engines
 */

const BLOCKED_PATTERNS = [
  "new engine",
  "createEngine",
  "deployEngine",
  "runtime.spawn",
  "initNewKernel"
];

function scanForSprawl(code = "") {
  return BLOCKED_PATTERNS.filter(p => code.includes(p));
}

function assertNoSprawl(code = "") {
  const hits = scanForSprawl(code);

  if (hits.length > 0) {
    throw new Error("SPRAWL_DETECTED: " + hits.join(", "));
  }

  return true;
}

module.exports = { assertNoSprawl };
