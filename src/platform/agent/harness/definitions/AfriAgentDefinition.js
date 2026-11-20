function freezeDeep(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep(child);
    Object.freeze(value);
  }
  return value;
}

export function validateAfriAgentDefinition(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("AFRI_AGENT_DEFINITION_INVALID");
  }

  for (const field of ["id", "key", "name"]) {
    if (typeof input[field] !== "string" || !input[field].trim()) {
      throw new Error(`AFRI_AGENT_DEFINITION_${field.toUpperCase()}_REQUIRED`);
    }
  }

  if (
    !Array.isArray(input.capabilities) ||
    input.capabilities.some(
      capability => typeof capability !== "string" || !capability.trim()
    )
  ) {
    throw new Error("AFRI_AGENT_DEFINITION_CAPABILITIES_INVALID");
  }

  const capabilities = input.capabilities.map(value => value.trim());

  if (new Set(capabilities).size !== capabilities.length) {
    throw new Error("AFRI_AGENT_DEFINITION_CAPABILITIES_INVALID");
  }

  const trustDomain = input.trustDomain || "EXTERNAL";

  if (!["INTERNAL", "EXTERNAL"].includes(trustDomain)) {
    throw new Error("AFRI_AGENT_DEFINITION_TRUST_DOMAIN_INVALID");
  }

  if (
    input.provider !== undefined &&
    (typeof input.provider !== "string" || !input.provider.trim())
  ) {
    throw new Error("AFRI_AGENT_DEFINITION_PROVIDER_INVALID");
  }

  if (
    input.configuration !== undefined &&
    (!input.configuration ||
      typeof input.configuration !== "object" ||
      Array.isArray(input.configuration))
  ) {
    throw new Error("AFRI_AGENT_DEFINITION_CONFIGURATION_INVALID");
  }

  return freezeDeep({
    id: input.id.trim(),
    key: input.key.trim(),
    name: input.name.trim(),
    organizationId: input.organizationId || null,
    trustDomain,
    capabilities,
    provider: input.provider?.trim() || null,
    configuration: { ...(input.configuration || {}) },
    initialStatus: "PENDING"
  });
}

export default Object.freeze({ validate: validateAfriAgentDefinition });
