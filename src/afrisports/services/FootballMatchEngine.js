import { ingestFromProvider } from "../../../modules/football/ingestion/FootballIngestionBoundary.js";

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
  return ingestFromProvider(PROVIDER, "fixtures", {
    league,
    ...(season ? { season } : {}),
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
  return ingestFromProvider(PROVIDER, "standings", league, season);
}

export async function getTopScorers(league, season) {
  return ingestFromProvider(PROVIDER, "scorers", league, season);
}

export async function getTeams(league, season) {
  return ingestFromProvider(PROVIDER, "teams", league, season);
}
