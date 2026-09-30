const capabilities = new Map();

const AfriAgentCapabilityRegistry = {

  register(input = {}) {
    if (!input.id) {
      throw new Error("A2A_CAPABILITY_ID_REQUIRED");
    }

    const capability = {
      id: input.id,
      service: input.service || null,
      description: input.description || "",
      handler: input.handler,
      enabled: input.enabled !== false,
      adminOnly: input.adminOnly === true,
      registeredAt: Date.now()
    };

    capabilities.set(capability.id, capability);

    return capability;
  },

  get(id) {
    return capabilities.get(id) || null;
  },

  enable(id) {
    const capability = capabilities.get(id);

    if (!capability) return null;

    capability.enabled = true;
    return capability;
  },

  disable(id) {
    const capability = capabilities.get(id);

    if (!capability) return null;

    capability.enabled = false;
    return capability;
  },

  list() {
    return [...capabilities.values()].map(
      ({ handler, ...metadata }) => metadata
    );
  },

  stats() {
    const all = [...capabilities.values()];

    return {
      capabilities: all.length,
      enabled: all.filter(c => c.enabled).length,
      disabled: all.filter(c => !c.enabled).length
    };
  }

};

export default AfriAgentCapabilityRegistry;
