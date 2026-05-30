function extractRouter(mod) {
  const candidate =
    mod?.router ||
    mod?.default ||
    mod;

  // Express Router MUST be callable AND have .use OR be function middleware
  const isValid =
    candidate &&
    (
      typeof candidate === 'function' ||
      typeof candidate?.use === 'function'
    );

  return isValid ? candidate : null;
}

module.exports = { extractRouter };
