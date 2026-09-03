import FootballProviderRegistry from "./FootballProviderRegistry.js";
import APIfootballFootballProvider from "../providers/APIfootballFootballProvider.js";
import SportMonksFootballProvider from "../providers/SportMonksFootballProvider.js";

export function registerDefaultFootballProviders() {
  for (const provider of [
    APIfootballFootballProvider,
    SportMonksFootballProvider
  ]) {
    if (!FootballProviderRegistry.has(provider.name)) {
      FootballProviderRegistry.register(provider);
    }
  }

  return FootballProviderRegistry.all();
}

export default registerDefaultFootballProviders;
