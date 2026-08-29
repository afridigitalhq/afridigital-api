import { ingestFromProvider } from "../../../modules/football/ingestion/FootballIngestionBoundary.js";
import { resolveCompetition, resolveCompetitionForProvider } from "../../../modules/football/orchestration/FootballCompetitionResolver.js";
import { rankBigMatches } from "./FootballAnalyticsService.js";

const PROVIDER = "SportMonks";

const PRIORITY_COMPETITIONS = Object.freeze([
  "premierLeague",
  "championsLeague"
]);

function today() {
  return new Date().toISOString().split("T")[0];
}

function extractMatches(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.matches)) return result.matches;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.response)) return result.response;
  return [];
}

function filterMatchesByDate(matches = [], date) {
  const target = String(date ?? "").slice(0, 10);
  if (!target) return [];

  return matches.filter(match => {
    const kickoff = match?.kickoff ?? match?.starting_at ?? null;
    return kickoff && String(kickoff).slice(0, 10) === target;
  });
}

function resolvePrimaryCompetition(key) {
  const resolved = resolveCompetition(key);

  return Object.freeze({
    competitionKey: key,
    provider: resolved.provider,
    leagueId: resolved.leagueId,
    seasonId: resolved.seasonId ?? null
  });
}

async function loadCompetitionFixtures(competitionKey, date) {
  const resolved = resolvePrimaryCompetition(competitionKey);

  const options = {
    date,
    league: resolved.leagueId
  };

  if (resolved.seasonId) {
    options.season = resolved.seasonId;
    options.seasonId = resolved.seasonId;
  }

  if (resolved.provider === "SportMonks") {
    options.include = "participants;league;season";
  }

  const result = await ingestFromProvider(
    resolved.provider,
    "fixtures",
    options
  );

  const matches = filterMatchesByDate(
    extractMatches(result),
    date
  );

  return matches.map(match => ({
    ...match,
    competitionKey,
    competitionProvider: resolved.provider
  }));
}

export async function getLiveFeed() {
  const results = await Promise.allSettled(
    PRIMARY_COMPETITIONS.map(async competitionKey => {
      const resolved = resolvePrimaryCompetition(competitionKey);

      const result = await ingestFromProvider(
        resolved.provider,
        "live"
      );

      return extractMatches(result).map(match => ({
        ...match,
        competitionKey,
        competitionProvider: resolved.provider
      }));
    })
  );

  const matches = results
    .filter(result => result.status === "fulfilled")
    .flatMap(result => result.value);

  return {
    source: "AfriSports",
    type: "LIVE",
    count: matches.length,
    matches: rankBigMatches(matches)
  };
}

async function getPriorityFixtures(date) {
  const results = await Promise.all(
    PRIORITY_COMPETITIONS.map(async competitionKey => {
      const competition = resolveCompetitionForProvider(
        competitionKey,
        PROVIDER
      );

      const seasonId =
        competition.seasonId ||
        await resolveSportMonksSeason(competition.leagueId);

      const result = await ingestFromProvider(PROVIDER, "fixtures", {
        date,
        leagueId: competition.leagueId,
        ...(seasonId ? { seasonId } : {}),
        include: "participants;league;season"
      });

      return extractMatches(result).map(match => ({
        ...match,
        competitionKey,
        competitionName: competition.competition?.name || competitionKey
      }));
    })
  );

  return results.flat();
}

export async function getTodayFeed() {
  const targetDate = today();
  const matches = filterMatchesByDate(
    await getPriorityFixtures(targetDate),
    targetDate
  );

  return {
    source: PROVIDER,
    type: "TODAY",
    date: targetDate,
    count: matches.length,
    matches: rankBigMatches(matches)
  };
}

export async function getDiscoveryFeed() {
  const targetDate = today();
  const matches = filterMatchesByDate(
    await getPriorityFixtures(targetDate),
    targetDate
  );

  return {
    source: PROVIDER,
    type: "DISCOVERY",
    count: matches.length,
    matches: rankBigMatches(matches)
  };
}

export async function getFeaturedFeed() {
  const todayFeed = await getTodayFeed();

  return {
    source: "AfriAI Match Radar",
    type: "FEATURED",
    count: todayFeed.matches.length,
    matches: todayFeed.matches.slice(0, 20)
  };
}
