const DEFAULT_PROVIDER_ORDER = Object.freeze(["APIfootball", "SportMonks"]);

const MULTI_PROVIDER_CAPABILITIES = Object.freeze([
  "fixtures"
]);

function normalizeProviderName(value) {
  return String(value ?? "").trim();
}

function capableProviders(providers = [], capability) {
  return providers.filter(
    provider =>
      provider &&
      typeof provider.supports === "function" &&
      provider.supports(capability)
  );
}

export function selectFootballProviders({
  providers = [],
  capability,
  provider,
  preferredProvider,
  allowMultiple = false
} = {}) {
  if (!capability) {
    throw new Error("Football capability is required");
  }

  const capable = capableProviders(providers, capability);

  if (!capable.length) {
    throw new Error(
      `No registered football provider supports capability "${capability}"`
    );
  }

  const explicit = normalizeProviderName(provider);
  const preferred = normalizeProviderName(preferredProvider);

  if (explicit) {
    const selected = capable.find(
      candidate => candidate.name === explicit
    );

    if (!selected) {
      throw new Error(
        `Football provider "${explicit}" does not support capability "${capability}"`
      );
    }

    return [selected];
  }

  const ordered = [...capable].sort((a, b) => {
    const aIndex = DEFAULT_PROVIDER_ORDER.indexOf(a.name);
    const bIndex = DEFAULT_PROVIDER_ORDER.indexOf(b.name);

    const normalizedA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const normalizedB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

    return normalizedA - normalizedB;
  });

  if (preferred) {
    const preferredMatch = ordered.find(
      candidate => candidate.name === preferred
    );

    if (preferredMatch) {
      return allowMultiple &&
        MULTI_PROVIDER_CAPABILITIES.includes(capability)
        ? [
            preferredMatch,
            ...ordered.filter(candidate => candidate !== preferredMatch)
          ]
        : [preferredMatch];
    }
  }

  if (
    allowMultiple &&
    MULTI_PROVIDER_CAPABILITIES.includes(capability)
  ) {
    return ordered;
  }

  return [ordered[0]];
}

export function supportsMultipleFootballProviders(capability) {
  return MULTI_PROVIDER_CAPABILITIES.includes(capability);
}

export default Object.freeze({
  select: selectFootballProviders,
  supportsMultiple: supportsMultipleFootballProviders
});
