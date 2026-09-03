import { createFootballProviderContract } from "../contracts/FootballProviderContract.js";
import { createFootballMatch } from "../contracts/FootballMatchContract.js";
import { apiFootballFetch } from "../../apifootball/APIfootballClient.js";

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeEvent(event, type, matchId) {
  return {
    id: null,
    fixtureId: matchId,
    type,
    minute: event?.time ?? null,
    playerName:
      event?.home_scorer ||
      event?.away_scorer ||
      event?.home_fault ||
      event?.away_fault ||
      null,
    home: event?.home_scorer || event?.home_fault || null,
    away: event?.away_scorer || event?.away_fault || null,
    score: event?.score ?? null,
    provider: "APIfootball"
  };
}

function normalizeMatch(match = {}) {
  const kickoff =
    match.match_date && match.match_time
      ? `${match.match_date}T${match.match_time}:00`
      : match.match_date || null;

  const events = [
    ...(Array.isArray(match.goalscorer)
      ? match.goalscorer.map(event =>
          normalizeEvent(event, "goal", match.match_id)
        )
      : []),
    ...(Array.isArray(match.cards)
      ? match.cards.map(event =>
          normalizeEvent(event, "card", match.match_id)
        )
      : [])
  ];

  return createFootballMatch({
    id: match.match_id ?? null,
    status: match.match_status || null,
    kickoff,
    minute: null,
    league: {
      id: match.league_id ?? null,
      name: match.league_name ?? null,
      country: match.country_name ?? null
    },
    season: match.league_year ?? null,
    venue: match.match_stadium
      ? { name: match.match_stadium }
      : null,
    home: {
      id: match.match_hometeam_id ?? null,
      name: match.match_hometeam_name ?? null,
      badge: match.team_home_badge ?? null
    },
    away: {
      id: match.match_awayteam_id ?? null,
      name: match.match_awayteam_name ?? null,
      badge: match.team_away_badge ?? null
    },
    score: {
      home: toNumber(match.match_hometeam_score),
      away: toNumber(match.match_awayteam_score),
      halftimeHome: toNumber(match.match_hometeam_halftime_score),
      halftimeAway: toNumber(match.match_awayteam_halftime_score),
      extraHome: toNumber(match.match_hometeam_extra_score),
      extraAway: toNumber(match.match_awayteam_extra_score),
      penaltyHome: toNumber(match.match_hometeam_penalty_score),
      penaltyAway: toNumber(match.match_awayteam_penalty_score)
    },
    events,
    metadata: {
      provider: "APIfootball",
      providerMatchId: match.match_id ?? null,
      providerLeagueId: match.league_id ?? null,
      providerCountryId: match.country_id ?? null,
      live: match.match_live === "1" || match.match_live === 1,
      raw: match
    }
  });
}

async function getFixtures(options = {}) {
  const params = {
    action: "get_events"
  };

  if (options.date) {
    params.from = options.date;
    params.to = options.date;
  } else {
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
  }

  if (options.leagueId != null) params.league_id = options.leagueId;
  if (options.teamId != null) params.team_id = options.teamId;
  if (options.matchId != null) params.match_id = options.matchId;
  if (options.live) params.match_live = "1";

  const data = await apiFootballFetch(params);
  return Array.isArray(data) ? data.map(normalizeMatch) : [];
}

async function getFixture(fixtureId) {
  return getFixtures({ matchId: fixtureId });
}

async function getLive(options = {}) {
  return getFixtures({
    ...options,
    live: true
  });
}

async function getEvents(fixtureId) {
  return getFixture(fixtureId);
}

async function getLineups(fixtureId) {
  return apiFootballFetch({
    action: "get_lineups",
    match_id: fixtureId
  });
}

async function getStandings(leagueId) {
  return apiFootballFetch({
    action: "get_standings",
    league_id: leagueId
  });
}

async function getScorers(leagueId) {
  return apiFootballFetch({
    action: "get_topscorers",
    league_id: leagueId
  });
}

async function getTeams(leagueId) {
  return apiFootballFetch({
    action: "get_teams",
    league_id: leagueId
  });
}

async function getLeagues() {
  return apiFootballFetch({
    action: "get_leagues"
  });
}

const APIfootballFootballProvider = createFootballProviderContract({
  name: "APIfootball",
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

export default APIfootballFootballProvider;
