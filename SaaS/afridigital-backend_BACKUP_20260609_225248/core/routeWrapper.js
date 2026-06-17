function normalizeRoute(mod) {
  // direct router export
  if (typeof mod === 'function') return mod;

  // express Router exported as { router }
  if (mod && typeof mod.router === 'function') return mod.router;

  // ESModule default export
  if (mod && typeof mod.default === 'function') return mod.default;

  // last resort invalid module
  throw new Error('Invalid route module export');
}

module.exports = { normalizeRoute };
