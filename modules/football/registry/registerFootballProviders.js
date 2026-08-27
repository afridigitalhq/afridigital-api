import FootballProviderRegistry from "./FootballProviderRegistry.js";
import SportMonksFootballProvider from "../providers/SportMonksFootballProvider.js";
import ApiFootballProvider from "../providers/ApiFootballProvider.js";

export function registerDefaultFootballProviders() {
  for (const provider of [
    SportMonksFootballProvider,
    ApiFootballProvider
  ]) {
    if (!FootballProviderRegistry.has(provider.name)) {
      FootballProviderRegistry.register(provider);
    }
  }

  return FootballProviderRegistry.all();
}

export default registerDefaultFootballProviders;
