// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
let locked = true;

function assertNoSprawl(target) {
  if (!locked) return;

  const forbidden = [
    "createEngine",
    "new Runtime",
    "initPipeline",
    "spawnKernel",
    "bootstrapSystem"
  ];

  const hit = forbidden.find(f => String(target).includes(f));

  if (hit) {
    throw new Error("SPRAWL_GUARD_TRIGGERED: " + hit);
  }
}

module.exports = { assertNoSprawl };
