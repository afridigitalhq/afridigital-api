import {
  getFixtures,
  getLeagueFixtures,
  getMatchEvents,
  getLineups,
  getStandings,
  getTopScorers,
  getTeams,
  getLiveMatches
} from "../../../src/afrisports/services/FootballMatchEngine.js";
import { createFootballProviderContract } from "../contracts/FootballProviderContract.js";
import { createFootballMatch } from "../contracts/FootballMatchContract.js";

export function normalizeApiFootballMatch(match = {}) {
  return createFootballMatch({
    id: match?.fixture?.id ?? match?.id ?? null,
    status: match?.fixture?.status ?? match?.status ?? null,
    kickoff: match?.fixture?.date ?? match?.kickoff ?? null,
    league: match?.league ?? null,
    season: match?.league?.season ?? match?.season ?? null,
    venue: match?.fixture?.venue ?? match?.venue ?? null,
    home: match?.teams?.home ?? match?.home ?? null,
    away: match?.teams?.away ?? match?.away ?? null,
    score: match?.goals ?? match?.score ?? null,
    events: Array.isArray(match?.events) ? match.events : [],
    metadata: { provider: "API-Football", nativeShape: "api-football-fixture" }
  });
}

async function getNormalizedFixtures(options = {}) {
  const result = await getFixtures(options?.date);
  return {
    data: Array.isArray(result?.response) ? result.response.map(normalizeApiFootballMatch) : [],
    meta: result?.paging ?? null,
    provider: "API-Football"
  };
}

async function getNormalizedFixture(fixtureId) {
  const result = await getFixtures();
  const match = (result?.response || []).find(item => String(item?.fixture?.id) === String(fixtureId));
  return match ? normalizeApiFootballMatch(match) : null;
}

const ApiFootballProvider = createFootballProviderContract({
  name: "API-Football",
  capabilities: [
    "fixtures",
    "fixture",
    "live",
    "events",
    "lineups",
    "standings",
    "scorers",
    "teams"
  ],
  getFixtures: getNormalizedFixtures,
  getFixture: getNormalizedFixture,
  getLive: getLiveMatches,
  getEvents: getMatchEvents,
  getLineups,
  getStandings,
  getScorers: getTopScorers,
  getTeams
});

export default ApiFootballProvider;
