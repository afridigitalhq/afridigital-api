import { ingestFromProvider } from "../../../modules/football/ingestion/FootballIngestionBoundary.js";


import { resolveCompetition, resolveCompetitionForProvider } from "../../../modules/football/orchestration/FootballCompetitionResolver.js";
export async function getFixtures(date) {
  const resolved = resolveCompetitionForProvider("premierLeague", "API-Football");
  return ingestFromProvider(resolved.provider, "fixtures", {
    ...(date ? { date } : {}),
    league: resolved.leagueId
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
  return ingestFromProvider(resolved.provider, "fixtures", {
    leagueId,
    ...(seasonId ? { seasonId } : {}),
    include: "participants;league"
  });
}

export async function getMatchEvents(fixture) {
  return ingestFromProvider(resolveCompetition(fixture?.league?.key || fixture?.competitionKey || "premierLeague").provider, "events", fixture);
}

export async function getLineups(fixture) {
  return ingestFromProvider(resolveCompetition(fixture?.league?.key || fixture?.competitionKey || "premierLeague").provider, "lineups", fixture);
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
