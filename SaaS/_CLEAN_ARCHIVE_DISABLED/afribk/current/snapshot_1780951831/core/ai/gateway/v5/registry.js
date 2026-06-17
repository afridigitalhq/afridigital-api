function selectProvider(req) {
  return {
    name: "mock",
    generate: async (input) => {
      return `[MOCK]${input}`;
    }
  };
}

module.exports = { selectProvider };
