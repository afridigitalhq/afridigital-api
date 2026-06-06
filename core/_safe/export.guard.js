function safeExport(mod, fallback = {}) {
  if (!mod) return fallback;

  // ensure object export shape
  if (typeof mod === 'function') {
    return { execute: mod };
  }

  if (typeof mod === 'object') {
    return mod;
  }

  return fallback;
}

module.exports = { safeExport };
