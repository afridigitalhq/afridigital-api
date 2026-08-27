const providers = new Map();

export function registerFootballProvider(provider) {
  if (!provider?.name) {
    throw new Error("Invalid football provider");
  }

  if (providers.has(provider.name)) {
    throw new Error(`Duplicate football provider blocked: ${provider.name}`);
  }

  providers.set(provider.name, provider);
  return provider;
}

export function getFootballProvider(name) {
  return providers.get(name);
}

export function getFootballProviders() {
  return [...providers.values()];
}

export function hasFootballProvider(name) {
  return providers.has(name);
}

export default {
  register: registerFootballProvider,
  get: getFootballProvider,
  all: getFootballProviders,
  has: hasFootballProvider
};
