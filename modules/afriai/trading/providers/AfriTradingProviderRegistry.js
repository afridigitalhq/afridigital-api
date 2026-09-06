const AfriTradingProviderRegistry = {
  providers: {},

  register(name, provider) {
    if (!name || !provider) {
      throw new Error("Invalid Afri trading provider");
    }

    if (this.providers[name]) {
      throw new Error(`Duplicate Afri trading provider: ${name}`);
    }

    this.providers[name] = provider;
    return provider;
  },

  get(name) {
    return this.providers[name] || null;
  },

  list() {
    return Object.keys(this.providers);
  },

  all() {
    return Object.values(this.providers);
  }
};

export default AfriTradingProviderRegistry;
