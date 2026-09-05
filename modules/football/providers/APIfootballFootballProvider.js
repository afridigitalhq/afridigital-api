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
      ? (() => {
          const [hours, minutes] = String(match.match_time).split(":").map(Number);
          const date = new Date(`${match.match_date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00Z`);
          date.setUTCHours(date.getUTCHours() - 1);
          return date.toISOString().slice(0, 19).replace("T", " ");
        })()
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
    minute: (() => {
      const status = String(match.match_status ?? "").trim();
      const numericStatus = Number(status);
      if (Number.isFinite(numericStatus)) return numericStatus;
      return toNumber(
        match.match_live_time ??
        match.match_elapsed ??
        match.match_minute ??
        match.time?.elapsed ??
        null
      );
    })(),
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
  const buildParams = (extra = {}) => ({
    action: "get_events",
    ...extra,
    ...(options.leagueId != null ? { league_id: options.leagueId } : {}),
    ...(options.teamId != null ? { team_id: options.teamId } : {}),
    ...(options.matchId != null ? { match_id: options.matchId } : {}),
    ...(options.live ? { match_live: "1" } : {})
  });

  if (options.matchId != null || options.live) {
    const data = await apiFootballFetch(buildParams());
    return Array.isArray(data) ? data.map(normalizeMatch) : [];
  }

  if (options.date) {
    const data = await apiFootballFetch(
      buildParams({ from: options.date, to: options.date })
    );
    return Array.isArray(data) ? data.map(normalizeMatch) : [];
  }

  if (options.from || options.to) {
    const data = await apiFootballFetch(
      buildParams({
        ...(options.from ? { from: options.from } : {}),
        ...(options.to ? { to: options.to } : {})
      })
    );
    return Array.isArray(data) ? data.map(normalizeMatch) : [];
  }

  const season = String(options.seasonId || options.season || "");
  const seasonMatch = season.match(/^(\d{4})\/(\d{4})$/);

  if (seasonMatch) {
    const startYear = Number(seasonMatch[1]);
    const endYear = Number(seasonMatch[2]);
    const results = [];

    for (let year = startYear, month = 8; year < endYear || (year === endYear && month <= 5); ) {
      const from = `${year}-${String(month).padStart(2, "0")}-01`;
      const nextYear = month === 12 ? year + 1 : year;
      const nextMonth = month === 12 ? 1 : month + 1;
      const lastDay = new Date(Date.UTC(nextYear, nextMonth, 0)).getUTCDate();
      const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const data = await apiFootballFetch(buildParams({ from, to }));
      if (Array.isArray(data)) results.push(...data);

      year = nextYear;
      month = nextMonth;
    }

    const unique = new Map();
    for (const match of results) {
      const id = String(match?.match_id ?? "");
      if (id && !unique.has(id)) unique.set(id, match);
    }

    return [...unique.values()].map(normalizeMatch);
  }

  const data = await apiFootballFetch(buildParams());
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
