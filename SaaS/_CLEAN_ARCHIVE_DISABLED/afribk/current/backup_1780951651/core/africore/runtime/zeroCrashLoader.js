const fs = require("fs");

function safeRequire(path, name = "module") {
  try {
    const mod = require(path);

    // function middleware (valid express router)
    if (typeof mod === "function") return mod;

    // express router inside object
    if (mod && typeof mod.router === "function") return mod.router;

    // default export
    if (mod && typeof mod.default === "function") return mod.default;

    console.log(`⚠️ ZCKL: Invalid export in ${name}, using fallback router`);
    return (req, res, next) => next();

  } catch (e) {
    console.log(`🧨 ZCKL: Failed to load ${name}:`, e.message);
    return (req, res, next) => next();
  }
}

function safeKernelRequire(path, fallback = {}) {
  try {
    return require(path);
  } catch (e) {
    console.log("🧠 ZCKL kernel fallback activated:", e.message);
    return fallback;
  }
}

module.exports = {
  safeRequire,
  safeKernelRequire
};
