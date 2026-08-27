import { registerDefaultFootballProviders } from "../registry/registerFootballProviders.js";
import {
  selectFootballProviders
} from "./FootballProviderSelectionPolicy.js";

function resolveRegistry(providerRegistry) {
  const registry = providerRegistry || registerDefaultFootballProviders();
  return Array.isArray(registry) ? registry : registry.all();
}

export async function executeFootballCapability({
  capability,
  provider,
  providers,
  preferredProvider,
  allowMultiple = false,
  args = []
} = {}) {
  if (!capability) {
    throw new Error("Football capability is required");
  }

  const registry = resolveRegistry(providers);

  const selectedProviders = selectFootballProviders({
    providers: registry,
    capability,
    provider,
    preferredProvider,
    allowMultiple
  });

  if (allowMultiple) {
    return Promise.all(
      selectedProviders.map(async selectedProvider => {
        try {
          return {
            status: "fulfilled",
            provider: selectedProvider.name,
            result: await selectedProvider.execute(capability, ...args)
          };
        } catch (error) {
          return {
            status: "rejected",
            provider: selectedProvider.name,
            reason: error
          };
        }
      })
    );
  }

  return selectedProviders[0].execute(capability, ...args);
}

export default Object.freeze({
  execute: executeFootballCapability
});
