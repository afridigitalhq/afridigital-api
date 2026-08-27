import {
  getSportMonksFixtures,
  getSportMonksFixture,
  getSportMonksLeague,
  sportMonksFetch
} from "../../sportmonks/SportMonksClient.js";
import { createFootballProviderContract } from "../contracts/FootballProviderContract.js";
import { createFootballMatch } from "../contracts/FootballMatchContract.js";

const SPORTMONKS_STATUS_MAP = Object.freeze({1:"NS",2:"1H",3:"HT",4:"BRK",5:"FT",6:"ET",7:"AET",8:"FT_PEN",9:"PEN",10:"POST",11:"SUSP",12:"CANC",13:"TBA",14:"WO",15:"ABAN",16:"DELA",17:"AWAR",18:"INT",19:"AU",20:"DEL",21:"ETB",22:"2H",23:"2ET",25:"PENB",26:"PENDING"});\n\nfunction normalizeSportMonksStatus(match = {}) {\n  const stateId = Number(match?.state_id);\n  return SPORTMONKS_STATUS_MAP[stateId] || match?.state?.short_name || match?.state?.state || match?.state || null;\n}\n\nfunction normalizeSportMonksMatch(match = {}) {
  const participants = Array.isArray(match.participants)
    ? match.participants
    : [];

  const participantHome =
    participants.find(participant => participant?.meta?.location === "home") ||
    participants[0] ||
    null;

  const participantAway =
    participants.find(participant => participant?.meta?.location === "away") ||
    participants[1] ||
    null;

  const parsedTeams = String(match.name ?? "")
    .split(/\s+vs\s+/i)
    .map(name => name.trim())
    .filter(Boolean);

  const home =
    participantHome ||
    (parsedTeams[0] ? { name: parsedTeams[0] } : null);

  const away =
    participantAway ||
    (parsedTeams[1] ? { name: parsedTeams[1] } : null);

  return createFootballMatch({
    id: match.id ?? null,
    status: normalizeSportMonksStatus(match),
    kickoff: match.starting_at ?? null,
    league: match.league ?? (
      match.league_id ? { id: match.league_id } : null
    ),
    season: match.season ?? (
      match.season_id ? { id: match.season_id } : null
    ),
    venue: match.venue ?? (
      match.venue_id ? { id: match.venue_id } : null
    ),
    home,
    away,
    score: match.result_info ?? match.score ?? null,
    events: Array.isArray(match.events) ? match.events : [],
    metadata: {
      provider: "SportMonks",
      providerMatchId: match.id ?? null,
      providerSportId: match.sport_id ?? null,
      providerLeagueId: match.league_id ?? null,
      providerSeasonId: match.season_id ?? null,
      providerRoundId: match.round_id ?? null,
      providerStateId: match.state_id ?? null,
      providerVenueId: match.venue_id ?? null,
      providerName: match.name ?? null,
      providerPayload: match
    }
  });
}

function extractData(result) {
  return Array.isArray(result?.data) ? result.data : [];
}

async function getFixtures(options = {}) {
  const result = await getSportMonksFixtures({
    ...options,
    include: options.include || "participants;league;season"
  });

  return {
    data: extractData(result).map(normalizeSportMonksMatch),
    meta: result?.meta ?? null,
    provider: "SportMonks"
  };
}

async function getFixture(fixtureId, include = "participants;league;season") {
  const result = await getSportMonksFixture(fixtureId, include);

  return {
    data: result?.data
      ? normalizeSportMonksMatch(result.data)
      : null,
    meta: result?.meta ?? null,
    provider: "SportMonks"
  };
}

async function getLive() {
  const result = await sportMonksFetch(
    "/livescores/inplay?include=participants;league;season"
  );

  return {
    data: extractData(result).map(normalizeSportMonksMatch),
    meta: result?.meta ?? null,
    provider: "SportMonks"
  };
}

async function getEvents(fixtureId) {
  const result = await getSportMonksFixture(fixtureId, "events");

  const fixture = result?.data || null;

  return {
    data: Array.isArray(fixture?.events) ? fixture.events : [],
    meta: result?.meta ?? null,
    provider: "SportMonks"
  };
}

async function getLineups(fixtureId) {
  const result = await getSportMonksFixture(fixtureId, "lineups");

  const fixture = result?.data || null;

  return {
    data: Array.isArray(fixture?.lineups) ? fixture.lineups : [],
    meta: result?.meta ?? null,
    provider: "SportMonks"
  };
}

async function getStandings(leagueId, seasonId) {
  const query = new URLSearchParams();

  if (seasonId) query.set("season_id", String(seasonId));

  const suffix = query.toString() ? `?${query}` : "";

  const result = await sportMonksFetch(
    `/standings/seasons/${seasonId || leagueId}${suffix}`
  );

  return {
    data: extractData(result),
    meta: result?.meta ?? null,
    provider: "SportMonks"
  };
}

async function getScorers(leagueId, seasonId) {
  const result = await sportMonksFetch(
    `/topscorers/seasons/${seasonId || leagueId}`
  );

  return {
    data: extractData(result),
    meta: result?.meta ?? null,
    provider: "SportMonks"
  };
}

async function getTeams(leagueId, seasonId) {
  const result = await sportMonksFetch(
    `/teams/seasons/${seasonId || leagueId}`
  );

  return {
    data: extractData(result),
    meta: result?.meta ?? null,
    provider: "SportMonks"
  };
}

async function getLeagues() {
  const result = await getSportMonksLeague("271");

  return {
    data: result?.data ? [result.data] : [],
    meta: result?.meta ?? null,
    provider: "SportMonks"
  };
}

const SportMonksFootballProvider = createFootballProviderContract({
  name: "SportMonks",
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

export default SportMonksFootballProvider;
