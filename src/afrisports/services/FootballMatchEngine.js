import { ingestFromProvider } from "../../../modules/football/ingestion/FootballIngestionBoundary.js";


import { resolveCompetition, resolveCompetitionForProvider } from "../../../modules/football/orchestration/FootballCompetitionResolver.js";
export async function getFixtures(date) {
  const resolved = resolveCompetition("premierLeague");
  return ingestFromProvider(resolved.provider, "fixtures", {
    ...(date ? { date } : {}),
    leagueId: resolved.leagueId,
    ...(resolved.seasonId ? { seasonId: resolved.seasonId } : {})
  });
}

export async function getLiveMatches() {
  return ingestFromProvider(resolveCompetition("premierLeague").provider, "live");
}

export async function getLeagueFixtures(league, season) {
  const competition = resolveCompetition(league);
  const leagueId = competition?.leagueId ?? league;
  const seasonId = season || competition?.seasonId || null;
  const resolved = resolveCompetition(league || "premierLeague");
  const seasonMatch = String(seasonId || "").match(/^(\d{4})\/(\d{4})$/);
  const from = seasonMatch ? seasonMatch[1] + "-08-01" : null;
  const to = seasonMatch ? seasonMatch[2] + "-05-31" : null;
  return ingestFromProvider(resolved.provider, "fixtures", {
    leagueId,
    ...(seasonId ? { seasonId } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    include: "participants;league"
  });
}

export async function getMatchEvents(fixture) {
  const fixtureId = fixture?.id ?? fixture?.fixtureId ?? fixture; return ingestFromProvider(resolveCompetition(fixture?.league?.key || fixture?.competitionKey || "premierLeague").provider, "events", fixtureId);
}

export async function getLineups(fixture) {
  const fixtureId = fixture?.id ?? fixture?.fixtureId ?? fixture; return ingestFromProvider(resolveCompetition(fixture?.league?.key || fixture?.competitionKey || "premierLeague").provider, "lineups", fixtureId);
}

export async function getStandings(league, season) {
  const competition = resolveCompetition(league);
  const leagueId = competition?.leagueId ?? league;
  const seasonId = season || competition?.seasonId || null;

  return ingestFromProvider(competition.provider, "standings", leagueId, seasonId);
}

export async function getTopScorers(league, season) {
  const competition = resolveCompetition(league);
  const leagueId = competition?.leagueId ?? league;
  const seasonId = season || competition?.seasonId || null;

  return ingestFromProvider(competition.provider, "scorers", leagueId, seasonId);
}

export async function getTeams(league, season) {
  const competition = resolveCompetition(league);
  const leagueId = competition?.leagueId ?? league;
  const seasonId = season || competition?.seasonId || null;

  return ingestFromProvider(competition.provider, "teams", leagueId, seasonId);
}
