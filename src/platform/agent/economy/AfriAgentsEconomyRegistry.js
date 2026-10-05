import AfriAgentsEconomyStore
  from "./AfriAgentsEconomyStore.js";

const services = new Map();

function requireText(value, errorCode) {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new Error(errorCode);
  }

  return value.trim();
}

function normalizeUSD(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("AFRI_ECONOMY_INVALID_USD_AMOUNT");
  }

  return Number(amount.toFixed(8));
}

function normalizePricing(pricing = {}) {
  const model = requireText(
    pricing.model,
    "AFRI_ECONOMY_PRICING_MODEL_REQUIRED"
  ).toUpperCase();

  if (!["FIXED", "TIERED", "USAGE"].includes(model)) {
    throw new Error("AFRI_ECONOMY_INVALID_PRICING_MODEL");
  }

  if (model === "FIXED") {
    return Object.freeze({
      model,
      currency: "USD",
      amountUSD: normalizeUSD(pricing.amountUSD)
    });
  }

  if (model === "TIERED") {
    if (!Array.isArray(pricing.tiers) || pricing.tiers.length === 0) {
      throw new Error("AFRI_ECONOMY_PRICING_TIERS_REQUIRED");
    }

    const tiers = pricing.tiers.map((tier, index) => {
      if (!tier || typeof tier !== "object") {
        throw new Error(`AFRI_ECONOMY_INVALID_PRICING_TIER_${index}`);
      }

      return Object.freeze({
        id: requireText(
          tier.id,
          "AFRI_ECONOMY_PRICING_TIER_ID_REQUIRED"
        ),
        name: requireText(
          tier.name,
          "AFRI_ECONOMY_PRICING_TIER_NAME_REQUIRED"
        ),
        amountUSD: normalizeUSD(tier.amountUSD)
      });
    });

    return Object.freeze({
      model,
      currency: "USD",
      tiers: Object.freeze(tiers)
    });
  }

  return Object.freeze({
    model,
    currency: "USD",
    unit: requireText(
      pricing.unit,
      "AFRI_ECONOMY_USAGE_UNIT_REQUIRED"
    ),
    amountUSD: normalizeUSD(pricing.amountUSD)
  });
}

const AfriAgentsEconomyRegistry = {

  registerService({
    agentId,
    capability,
    service,
    description = null,
    pricing
  } = {}) {
    const normalizedAgentId = requireText(
      agentId,
      "AFRI_ECONOMY_AGENT_ID_REQUIRED"
    );

    const normalizedCapability = requireText(
      capability,
      "AFRI_ECONOMY_CAPABILITY_REQUIRED"
    );

    const normalizedService = requireText(
      service,
      "AFRI_ECONOMY_SERVICE_REQUIRED"
    );

    const record = Object.freeze({
      agentId: normalizedAgentId,
      capability: normalizedCapability,
      service: normalizedService,
      description:
        typeof description === "string"
          ? description.trim()
          : null,
      pricing: normalizePricing(pricing),
      status: "ACTIVE",
      registeredAt: Date.now()
    });

    const key =
      `${normalizedAgentId}:${normalizedCapability}`;

    services.set(key, record);
    AfriAgentsEconomyStore.saveService(key, record);

    return record;
  },

  getService({ agentId, capability } = {}) {
    if (!agentId || !capability) return null;

    const key = `${agentId}:${capability}`;

    return services.get(key)
      || AfriAgentsEconomyStore.getService(key)
      || null;
  },

  listServices() {
    const stored = AfriAgentsEconomyStore.listServices();

    for (const service of stored) {
      const key =
        `${service.agentId}:${service.capability}`;

      if (!services.has(key)) {
        services.set(key, Object.freeze(service));
      }
    }

    return [...services.values()];
  },

  deactivateService({ agentId, capability } = {}) {
    const existing = this.getService({
      agentId,
      capability
    });

    if (!existing) return null;

    const inactive = Object.freeze({
      ...existing,
      status: "INACTIVE",
      deactivatedAt: Date.now()
    });

    const key =
      `${existing.agentId}:${existing.capability}`;

    services.set(key, inactive);
    AfriAgentsEconomyStore.saveService(key, inactive);

    return inactive;
  }

};

export default AfriAgentsEconomyRegistry;
