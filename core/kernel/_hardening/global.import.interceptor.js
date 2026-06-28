// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const Module = require("module");

const originalRequire = Module.prototype.require;

const FORBIDDEN = [
  "event-engine",
  "event-spine",
  "spine",
  "ring",
  "kernel.spine",
  "eventEngine"
];

Module.prototype.require = function (path) {
  for (const f of FORBIDDEN) {
    if (path.includes(f)) {
      throw new Error(
        "⛔ KERNEL IMPORT VIOLATION: blocked module -> " + path
      );
    }
  }

  return originalRequire.apply(this, arguments);
};
