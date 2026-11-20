const createRecord = (input, registeredAt = Date.now()) => {
  if (!input || typeof input.id !== "string" || !input.id.trim()) {
    throw new Error("A2A_CAPABILITY_ID_REQUIRED");
  }
  return Object.freeze({
    id: input.id,
    service: input.service || null,
    description: input.description || "",
    handler: input.handler,
    enabled: input.enabled !== false,
    adminOnly: input.adminOnly === true,
    internalOnly: input.internalOnly === true,
    registeredAt
  });
};

export function createAfriAgentCapabilityRegistry() {
  const capabilities = new Map();

  const registry = {
    register(input = {}) {
      if (capabilities.has(input.id)) {
        throw new Error("A2A_CAPABILITY_ALREADY_REGISTERED");
      }
      const capability = createRecord(input);
      capabilities.set(capability.id, capability);
      return capability;
    },

    update(id, changes = {}) {
      const current = capabilities.get(id);
      if (!current) return null;
      if (changes.id !== undefined && changes.id !== id) {
        throw new Error("A2A_CAPABILITY_ID_IMMUTABLE");
      }
      const capability = createRecord(
        { ...current, ...changes, id },
        current.registeredAt
      );
      capabilities.set(id, capability);
      return capability;
    },

    upsert(input = {}) {
      if (capabilities.has(input.id)) {
        return registry.update(input.id, input);
      }
      return registry.register(input);
    },

    get(id) {
      return capabilities.get(id) || null;
    },

    enable(id) {
      return registry.update(id, { enabled: true });
    },

    disable(id) {
      return registry.update(id, { enabled: false });
    },

    list() {
      return [...capabilities.values()].map(({ handler, ...metadata }) =>
        Object.freeze(metadata)
      );
    },

    stats() {
      const all = [...capabilities.values()];
      return {
        capabilities: all.length,
        enabled: all.filter(item => item.enabled).length,
        disabled: all.filter(item => !item.enabled).length
      };
    }
  };

  return Object.freeze(registry);
}

const AfriAgentCapabilityRegistry = createAfriAgentCapabilityRegistry();
export default AfriAgentCapabilityRegistry;
