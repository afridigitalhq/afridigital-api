function isRouter(obj) {
  return obj &&
    typeof obj === 'function' &&
    obj.handle &&
    Array.isArray(obj.stack);
}

function isMiddleware(fn) {
  return typeof fn === 'function' && fn.length <= 4;
}

function extractRouter(mod) {
  if (!mod) return null;

  if (isRouter(mod)) return mod;

  if (isRouter(mod?.router)) return mod.router;

  if (mod?.router && isRouter(mod.router)) return mod.router;

  if (isMiddleware(mod)) return mod;

  return null;
}

function assertValidRoute(mod, filePath) {
  const extracted = extractRouter(mod);

  if (!extracted) {
    throw new Error(
      `[ROUTE LOADER ERROR] Invalid export in ${filePath}. Expected express.Router() or middleware function`
    );
  }

  return extracted;
}

module.exports = {
  extractRouter,
  assertValidRoute
};
