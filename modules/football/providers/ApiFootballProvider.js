import {
  getApiFootballFixtures,
  getApiFootballFixture,
  getApiFootballLiveMatches,
  getApiFootballEvents,
  getApiFootballLineups,
  getApiFootballStandings,
  getApiFootballTopScorers,
  getApiFootballTeams,
  getApiFootballLeagues
} from "./apiFootball/ApiFootballClient.js";
import { createFootballProviderContract } from "../contracts/FootballProviderContract.js";
import { createFootballMatch } from "../contracts/FootballMatchContract.js";

export function normalizeApiFootballMatch(match = {}) {
  return createFootballMatch({
    id: match?.fixture?.id ?? match?.id ?? null,
    status: match?.fixture?.status?.short ??
      match?.fixture?.status ??
      match?.status ??
      null,
    kickoff: match?.fixture?.date ?? match?.kickoff ?? null,
    league: match?.league ?? null,
    season: match?.league?.season ?? match?.season ?? null,
    venue: match?.fixture?.venue ?? match?.venue ?? null,
    home: match?.teams?.home ?? match?.home ?? null,
    away: match?.teams?.away ?? match?.away ?? null,
    score: match?.goals ?? match?.score ?? null,
    events: Array.isArray(match?.events) ? match.events : [],
    metadata: {
      provider: "API-Football",
      providerMatchId: match?.fixture?.id ?? match?.id ?? null,
      nativeShape: "api-football-fixture",
      providerPayload: match
    }
  });
}

function normalizeCollection(result) {
  return {
    data: Array.isArray(result?.response)
      ? result.response.map(normalizeApiFootballMatch)
      : [],
    meta: result?.paging ?? null,
    provider: "API-Football"
  };
}

async function getFixtures(options = {}) {
  return normalizeCollection(
    await getApiFootballFixtures(options)
  );
}

async function getFixture(fixtureId) {
  const result = await getApiFootballFixture(fixtureId);
  const match = Array.isArray(result?.response)
    ? result.response[0]
    : null;

  return {
    data: match ? normalizeApiFootballMatch(match) : null,
    meta: result?.paging ?? null,
    provider: "API-Football"
  };
}

async function getLive() {
  return normalizeCollection(
    await getApiFootballLiveMatches()
  );
}

async function getEvents(fixtureId) {
  const result = await getApiFootballEvents(fixtureId);

  return {
    data: Array.isArray(result?.response)
      ? result.response
      : [],
    meta: result?.paging ?? null,
    provider: "API-Football"
  };
}

async function getLineups(fixtureId) {
  const result = await getApiFootballLineups(fixtureId);

  return {
    data: Array.isArray(result?.response)
      ? result.response
      : [],
    meta: result?.paging ?? null,
    provider: "API-Football"
  };
}

async function getStandings(league, season) {
  const result = await getApiFootballStandings(league, season);

  return {
    data: Array.isArray(result?.response)
      ? result.response
      : [],
    meta: result?.paging ?? null,
    provider: "API-Football"
  };
}

async function getScorers(league, season) {
  const result = await getApiFootballTopScorers(league, season);

  return {
    data: Array.isArray(result?.response)
      ? result.response
      : [],
    meta: result?.paging ?? null,
    provider: "API-Football"
  };
}

async function getTeams(league, season) {
  const result = await getApiFootballTeams(league, season);

  return {
    data: Array.isArray(result?.response)
      ? result.response
      : [],
    meta: result?.paging ?? null,
    provider: "API-Football"
  };
}

async function getLeagues(options = {}) {
  const result = await getApiFootballLeagues(options);

  return {
    data: Array.isArray(result?.response)
      ? result.response
      : [],
    meta: result?.paging ?? null,
    provider: "API-Football"
  };
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
    "teams",
    "leagues"
  ],
  getFixtures,
  getFixture,
  getLive,
  getEvents,
  getLineups,
  getStandings,
  getScorers,
  getTeams,
  getLeagues
});

export default ApiFootballProvider;
