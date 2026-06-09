async function normalize(provider) {
  if (provider.generate) return provider;

  if (provider.stream) {
    return {
      generate: async (input) => provider.stream(input)
    };
  }

  throw new Error("Invalid provider contract");
}

module.exports = { normalize };
