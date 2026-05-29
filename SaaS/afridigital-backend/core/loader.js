/**
 * AfriDigital Strict Route Contract Loader (Production Grade)
 * Prevents invalid Express modules from ever reaching app.use()
 */

/**
 * Detect Express Router more safely
 */
function isRouter(obj) {
  return (
    obj &&
    typeof obj === 'function' &&
    typeof obj.use === 'function' &&
    typeof obj.handle === 'function'
  );
}

/**
 * Detect middleware function
 */
function isMiddleware(fn) {
  return typeof fn === 'function' && fn.length <= 3;
}

/**
 * Normalize module export into a valid Express handler
 */
function resolveExport(mod, filePath) {
  const candidate = mod?.default || mod?.router || mod;

  if (isRouter(candidate)) {
    return { type: 'router', value: candidate };
  }

  if (isMiddleware(candidate)) {
    return { type: 'middleware', value: candidate };
  }

  throw new Error(
    `[ROUTE LOADER ERROR] Invalid export in ${filePath}. ` +
    `Expected express.Router() or middleware function, got: ${typeof candidate}`
  );
}

/**
 * Strict guard before mounting
 */
function assertMountable(resolved, filePath) {
  if (!resolved || !resolved.type) {
    throw new Error(`[ROUTE VALIDATION ERROR] Broken module: ${filePath}`);
  }

  if (resolved.type !== 'router' && resolved.type !== 'middleware') {
    throw new Error(`[ROUTE VALIDATION ERROR] Unsupported module type in ${filePath}`);
  }
}

module.exports = {
  resolveExport,
  assertMountable
};
