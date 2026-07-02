global.__AFRI_FROZEN__ = true;

console.log("❄️ AFRI SYSTEM FROZEN ACTIVE");

const Module = require("module");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const originalRequire = Module.prototype.require;

Module.prototype.require = function(req) {

  if (global.__AFRI_FROZEN__ && typeof req === "string") {

    if (
      req.includes("event-bus") ||
      req.includes("event.spine") ||
      (req.includes("spine") && !req.includes("redis.spine"))
    ) {
      throw new Error("❄️ FROZEN BLOCK: " + req);
    }
  }

  return originalRequire.call(this, req);
};
