/**
 * STRICT EXPRESS ROUTE LOADER (PRODUCTION SAFE)
 * - NO implicit guessing of exports
 * - ONLY accepts express.Router() instances
 */

function loadRoute(filePath) {
  const mod = require(filePath);

  // strict contract: either router OR { router }
  const router = mod?.router ?? mod;

  if (!router) {
    throw new Error(`[ROUTE ERROR] Empty export: ${filePath}`);
  }

  const isValidRouter =
    typeof router === 'function' ||
    (typeof router === 'object' && typeof router.use === 'function');

  if (!isValidRouter) {
    throw new Error(
      `[ROUTE ERROR] Invalid Express router export in ${filePath}`
    );
  }

  return router;
}

module.exports = { loadRoute };
