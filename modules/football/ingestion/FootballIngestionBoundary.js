import { registerDefaultFootballProviders } from "../registry/registerFootballProviders.js";
import { createFootballMatch } from "../contracts/FootballMatchContract.js";
import { deduplicateFootballFixtures } from "./FootballFixtureDeduplicator.js";
import { executeFootballCapability } from "../orchestration/FootballCapabilityOrchestrator.js";

function extractMatches(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.response)) return result.response;
  return [];
}

function filterFixturesByDateTime(matches = [], options = {}) {
  const date = options?.date ? String(options.date) : null;
  const fromTime = options?.fromTime ? String(options.fromTime) : null;
  const toTime = options?.toTime ? String(options.toTime) : null;

  if (!date && !fromTime && !toTime) return matches;

  return matches.filter(match => {
    const kickoff = match?.kickoff ?? match?.starting_at ?? null;

    if (!kickoff) return false;

    const value = String(kickoff);
    const kickoffDate = value.slice(0, 10);
    const kickoffTime = value.length >= 16 ? value.slice(11, 16) : null;

    if (date && kickoffDate !== date) return false;
    if (fromTime && (!kickoffTime || kickoffTime < fromTime)) return false;
    if (toTime && (!kickoffTime || kickoffTime > toTime)) return false;

    return true;
  });
}

export async function ingestFixtures({
  providers,
  options = {}
} = {}) {
  const registry = providers || registerDefaultFootballProviders();
  const selectedProviders = Array.isArray(registry)
    ? registry
    : registry.all();

  const results = await executeFootballCapability({
    capability: "fixtures",
    providers: selectedProviders,
    allowMultiple: true,
    args: [options]
  });

  const matches = [];
  const providerResults = [];
  const errors = [];

  for (const [index, result] of results.entries()) {
    if (result.status === "fulfilled") {
      const providerName =
        result.provider ||
        result.result?.provider ||
        selectedProviders[index]?.name ||
        "unknown";
      const providerResult = result.result;
      const providerMatches = extractMatches(providerResult).map(match =>
        createFootballMatch({
          ...match,
          metadata: {
            ...(match?.metadata || {}),
            provider: providerName
          }
        })
      );

      providerResults.push({
        provider: providerName,
        matches: providerMatches
      });

      matches.push(...providerMatches);
    } else {
      const reason = result.reason;
      errors.push({
        provider: result.provider || "unknown",
        message: reason?.message || "Football provider failed",
        status: reason?.status ?? null
      });
    }
  }

  const filteredMatches = filterFixturesByDateTime(matches, options);
  const deduplicatedMatches = deduplicateFootballFixtures(filteredMatches);

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
      sourceCount: results.length,
      multiSource: results.length > 1,
      rawCount: matches.length,
      filteredCount: filteredMatches.length,
      deduplicatedCount: deduplicatedMatches.length
    }
  };
}

export async function ingestFromProvider(
  providerName,
  capability,
  ...args
) {
  const result = await executeFootballCapability({
    capability,
    provider: providerName,
    args
  });

  if (capability === "fixtures") {
    const options = args[0] || {};
    const matches = filterFixturesByDateTime(
      extractMatches(result),
      options
    );

    if (Array.isArray(result)) return matches;

    if (Array.isArray(result?.data)) {
      return {
        ...result,
        data: matches
      };
    }

    if (Array.isArray(result?.response)) {
      return {
        ...result,
        response: matches
      };
    }
  }

  return result;
}

export default {
  ingestFixtures,
  ingestFromProvider
};
