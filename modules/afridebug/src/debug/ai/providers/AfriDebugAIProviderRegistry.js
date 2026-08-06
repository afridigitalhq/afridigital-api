const providers = {};

const AfriDebugAIProviderRegistry = {
  register(name, provider) {
    providers[name] = provider;
    return {
      registered: true,
      provider: name
    };
  },

  get(name) {
    return providers[name] || null;
  },

  list() {
    return Object.keys(providers);
  },

  count() {
    return Object.keys(providers).length;
  }
};

export default AfriDebugAIProviderRegistry;
