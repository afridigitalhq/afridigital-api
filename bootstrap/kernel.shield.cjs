const Module = require("module");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const originalRequire = Module.prototype.require;

const BLOCKED = [
  "event-bus/",
  "spine/",
  "/v17/",
  "/afridigital-core/kernel/events/event.bus.cjs/",
  "/afridigital-core/kernel/events/event.bus.cjs/",
  "/event.bus"
];

Module.prototype.require = function (req) {

  if (typeof req === "string") {
    for (const b of BLOCKED) {
      if (req.includes(b)) {
        throw new Error("AfriKernelViolation: blocked legacy system");
      }
    }
  }

  if (req === "AFRI_EVENTS") {
    return originalRequire.call(
      this,
      path.join(ROOT, "afridigital-core/kernel/events/event.bus.cjs")
    );
  }

  return originalRequire.call(this, req);
};

console.log("🧱 AFRI KERNEL SHIELD v2 ACTIVE");
