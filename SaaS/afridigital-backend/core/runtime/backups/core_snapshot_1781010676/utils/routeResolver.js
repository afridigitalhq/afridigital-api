function isFunction(fn) {
  return typeof fn === 'function';
}

function isExpressRouterLike(fn) {
  return fn && typeof fn === 'function' && typeof fn.use === 'function' && typeof fn.handle === 'function';
}

function unwrapModule(mod) {
  if (!mod) return null;

  if (mod.default) return mod.default;
  if (mod.router) return mod.router;
  if (mod.middleware) return mod.middleware;

  return mod;
}

function resolveExport(filePath, mod) {
  const candidate = unwrapModule(mod);

  if (isExpressRouterLike(candidate)) {
    return { type: 'router', value: candidate };
  }

  if (isFunction(candidate) && candidate.length <= 4) {
    return { type: 'middleware', value: candidate };
  }

  throw new Error(
    `[ROUTE LOADER ERROR] Invalid export in ${filePath}. Expected router or middleware. Got: ${typeof candidate}`
  );
}

function assertMountable(resolved, filePath) {
  if (!resolved || !resolved.type) {
    throw new Error(`[ROUTE VALIDATION ERROR] Broken module: ${filePath}`);
  }

  if (resolved.type !== 'router' && resolved.type !== 'middleware') {
    throw new Error(`[ROUTE VALIDATION ERROR] Unsupported module type: ${filePath}`);
  }
}

module.exports = {
  resolveExport,
  assertMountable
};
