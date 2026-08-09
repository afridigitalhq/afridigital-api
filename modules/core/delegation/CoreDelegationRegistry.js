const capabilities = new Map();

const CoreDelegationRegistry = {
  register(name, provider) {
    if (!name || !provider) {
      throw new Error("CoreDelegationRegistry.register requires name and provider");
    }

    capabilities.set(name, provider);

    return {
      name,
      provider,
      status: "REGISTERED"
    };
  },

  resolve(name) {
    return capabilities.get(name) || null;
  },

  list() {
    return Array.from(capabilities.keys());
  },

  has(name) {
    return capabilities.has(name);
  }
};

export default CoreDelegationRegistry;
