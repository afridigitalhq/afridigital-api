const Module = require("module");
const { RequestContext, enforce } = require("./runtime");

const originalLoad = Module._load;

Module._load = function(request, parent, isMain) {
  try {
    const ctx = new RequestContext(parent?.filename, request);
    enforce(ctx);
  } catch (e) {
    console.error("🧠 SANDBOX BLOCK:", e.message);
    throw e;
  }

  return originalLoad.apply(this, arguments);
};
