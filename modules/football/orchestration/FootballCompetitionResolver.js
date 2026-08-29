import { resolveFootballCompetition } from "../config/FootballCompetitionRegistry.js";
import FootballProviderRegistry from "../registry/FootballProviderRegistry.js";
import { registerDefaultFootballProviders } from "../registry/registerFootballProviders.js";

export function resolveCompetitionForProvider(competitionKey, providerName) {
  registerDefaultFootballProviders();
  const provider = FootballProviderRegistry.get(providerName);
  if (!provider) {
    throw new Error(`Football provider "${providerName}" is not registered`);
  }

  const competition = resolveFootballCompetition(competitionKey, providerName);

  if (!competition) {
    throw new Error(`Football competition "${competitionKey}" was not found in the canonical registry`);
  }

  return Object.freeze({
    competitionKey,
    provider: providerName,
    leagueId: competition.leagueId,
    seasonId: competition.seasonId ?? null,
    competition
  });
}

export function resolveCompetition(competitionKey, preferredProviders = []) {
  registerDefaultFootballProviders();
  const providers = preferredProviders.length
    ? preferredProviders
    : FootballProviderRegistry.all().map(provider => provider.name);

  for (const providerName of providers) {
    try {
      return resolveCompetitionForProvider(competitionKey, providerName);
    } catch {
      continue;
    }
  }

  throw new Error(
    `No registered football provider can resolve competition "${competitionKey}"`
  );
}

export default {
  resolveCompetition,
  resolveCompetitionForProvider
};
