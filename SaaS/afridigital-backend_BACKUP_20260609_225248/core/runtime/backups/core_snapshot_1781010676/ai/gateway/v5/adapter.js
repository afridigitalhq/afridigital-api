function normalizeProvider(provider) {
  if (!provider) throw new Error("Missing provider");

  // unify legacy run -> generate
  if (provider.generate) return provider;

  if (provider.run) {
    provider.generate = async (input) => provider.run(input);
    delete provider.run;
  }

  if (!provider.generate) {
    throw new Error("Invalid provider contract (no generate)");
  }

  return provider;
}

module.exports = { normalizeProvider };
