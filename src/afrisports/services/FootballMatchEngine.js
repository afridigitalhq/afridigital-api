import { ingestFromProvider } from "../../../modules/football/ingestion/FootballIngestionBoundary.js";
import { getSportMonksCompetition } from "../config/sportmonksCompetition.config.js";

const PROVIDER = "SportMonks";

export async function getFixtures(date) {
  return ingestFromProvider(PROVIDER, "fixtures", {
    ...(date ? { date } : {}),
    include: "participants;league;season"
  });
}

export async function getLiveMatches() {
  return ingestFromProvider(PROVIDER, "live");
}

export async function getLeagueFixtures(league, season) {
  const competition = getSportMonksCompetition(league);
  const leagueId = competition?.leagueId ?? league;
  const seasonId = season || competition?.currentSeasonId || null;

  return ingestFromProvider(PROVIDER, "fixtures", {
    leagueId,
    ...(seasonId ? { seasonId } : {}),
    include: "participants;league;season"
  });
}

export async function getMatchEvents(fixture) {
  return ingestFromProvider(PROVIDER, "events", fixture);
}

export async function getLineups(fixture) {
  return ingestFromProvider(PROVIDER, "lineups", fixture);
}

export async function getStandings(league, season) {
  const competition = getSportMonksCompetition(league);
  const leagueId = competition?.leagueId ?? league;
  const seasonId = season || competition?.currentSeasonId || null;

  return ingestFromProvider(PROVIDER, "standings", leagueId, seasonId);
}

export async function getTopScorers(league, season) {
  const competition = getSportMonksCompetition(league);
  const leagueId = competition?.leagueId ?? league;
  const seasonId = season || competition?.currentSeasonId || null;

  return ingestFromProvider(PROVIDER, "scorers", leagueId, seasonId);
}

export async function getTeams(league, season) {
  const competition = getSportMonksCompetition(league);
  const leagueId = competition?.leagueId ?? league;
  const seasonId = season || competition?.currentSeasonId || null;

  return ingestFromProvider(PROVIDER, "teams", leagueId, seasonId);
}
