function normalizeProvider(provider) {
  if (!provider || typeof provider.generate !== "function") {
    throw new Error("Provider must implement generate()");
  }
  return provider;
}

module.exports = { normalizeProvider };
