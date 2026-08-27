import { registerDefaultFootballProviders } from "../registry/registerFootballProviders.js";
import { createFootballMatch } from "../contracts/FootballMatchContract.js";
import { deduplicateFootballFixtures } from "./FootballFixtureDeduplicator.js";


function extractMatches(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.response)) return result.response;
  return [];
}

export async function ingestFixtures({
  providers,
  options = {}
} = {}) {
  const registry = providers || registerDefaultFootballProviders();

  const selectedProviders = Array.isArray(registry)
    ? registry
    : registry.all();

  const results = await Promise.allSettled(
    selectedProviders
      .filter(provider => provider.supports("fixtures"))
      .map(async provider => {
        const result = await provider.execute("fixtures", options);

        return {
          provider: provider.name,
          matches: extractMatches(result).map(match =>
            createFootballMatch({
              ...match,
              metadata: {
                ...(match?.metadata || {}),
                provider: provider.name
              }
            })
          )
        };
      })
  );

  const matches = [];
  const providerResults = [];
  const errors = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      providerResults.push(result.value);
      matches.push(...result.value.matches);
    } else {
      errors.push({
        message: result.reason?.message || "Football provider failed",
        status: result.reason?.status ?? null
      });
    }
  }

  const deduplicatedMatches = deduplicateFootballFixtures(matches);

  return {
    type: "FOOTBALL_INGESTION",
    count: deduplicatedMatches.length,
    matches: deduplicatedMatches,
    providers: providerResults.map(result => ({
      name: result.provider,
      count: result.matches.length
    })),
    errors,
    metadata: {
      sourceCount: providerResults.length,
      multiSource: providerResults.length > 1,
      rawCount: matches.length,
      deduplicatedCount: deduplicatedMatches.length
    }
  };
}

export async function ingestFromProvider(
  providerName,
  capability,
  ...args
) {
  const registry = registerDefaultFootballProviders();
  const provider = registry.find(item => item.name === providerName);

  if (!provider) {
    throw new Error(`Football provider not registered: ${providerName}`);
  }

  if (!provider.supports(capability)) {
    throw new Error(
      `Football provider "${providerName}" does not support "${capability}"`
    );
  }

  return provider.execute(capability, ...args);
}

export default {
  ingestFixtures,
  ingestFromProvider
};
