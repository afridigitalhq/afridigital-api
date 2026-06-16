const Module = require("module");
const path = require("path");
const { enforce } = require("./enforcer");

const originalLoad = Module._load;

Module._load = function(request, parent, isMain) {
  try {
    if (parent && parent.filename) {
      enforce(parent.filename, request);
    }
  } catch (e) {
    console.error("🚨 KERNEL BLOCK:", e.message);
    throw e;
  }

  return originalLoad.apply(this, arguments);
};
