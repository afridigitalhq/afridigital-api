import { createFootballMatch } from "../contracts/FootballMatchContract.js";

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function teamName(team) {
  return normalizeText(team?.name ?? team);
}

function kickoffKey(kickoff) {
  if (!kickoff) return "";
  const time = new Date(kickoff).getTime();
  return Number.isNaN(time) ? normalizeText(kickoff) : String(time);
}

export function createFixtureIdentity(match = {}) {
  const home = teamName(match.home);
  const away = teamName(match.away);
  const kickoff = kickoffKey(match.kickoff);
  const league = normalizeText(match.league?.name ?? match.league);

  return [home, away, kickoff, league].join("|");
}

export function deduplicateFootballFixtures(matches = []) {
  const groups = new Map();

  for (const rawMatch of matches) {
    const match = createFootballMatch(rawMatch);
    const identity = createFixtureIdentity(match);

    if (!groups.has(identity)) {
      groups.set(identity, {
        ...match,
        metadata: {
          ...match.metadata,
          providers: match.metadata?.provider
            ? [match.metadata.provider]
            : [],
          sources: [match]
        }
      });
      continue;
    }

    const existing = groups.get(identity);
    const provider = match.metadata?.provider;

    if (provider && !existing.metadata.providers.includes(provider)) {
      existing.metadata.providers.push(provider);
    }

    existing.metadata.sources.push(match);
  }

  return [...groups.values()];
}

export default {
  createFixtureIdentity,
  deduplicateFootballFixtures
};
