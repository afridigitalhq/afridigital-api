import { getActiveFootballCompetitions } from "../../../modules/football/config/FootballCompetitionRegistry.js";
import { resolveCompetition } from "../../../modules/football/orchestration/FootballCompetitionResolver.js";
import { getLeagueFixtures } from "./FootballMatchEngine.js";

export async function getFixtureUniverse() {
  const competitions = getActiveFootballCompetitions();
  const results = await Promise.allSettled(competitions.map(async (competition) => {
    const resolved = resolveCompetition(competition.key);
    const matches = await getLeagueFixtures(competition.key, resolved.seasonId);
    return matches.map((match) => ({
      id: match?.id ?? match?.fixtureId ?? null,
      status: match?.status ?? null,
      kickoff: match?.kickoff ?? null,
      minute: match?.minute ?? null,
      league: match?.league ?? null,
      season: match?.season ?? resolved.seasonId ?? null,
      venue: match?.venue ?? null,
      home: match?.home ?? null,
      away: match?.away ?? null,
      score: match?.score ?? null,
      competitionKey: competition.key,
      competition: competition.name,
      country: competition.country,
      provider: resolved.provider
    }));
  }));

  const matches = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  const unique = new Map();

  for (const match of matches) {
    const id = match?.id ?? match?.fixtureId ?? null;
    if (!id) continue;
    unique.set(String(id), match);
  }

  return Array.from(unique.values()).sort((a, b) => String(a?.kickoff ?? "").localeCompare(String(b?.kickoff ?? "")));
}
