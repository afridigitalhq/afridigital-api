module.exports = function(path) {
  const mod = require(path);

  // If it's already a router → return it
  if (typeof mod === "function") return mod;

  // If it exports .router
  if (mod && typeof mod.router === "function") return mod.router;

  // If it exports { default }
  if (mod && typeof mod.default === "function") return mod.default;

  // fallback: safe no-op middleware (prevents crash)
  return (req, res, next) => next();
};
