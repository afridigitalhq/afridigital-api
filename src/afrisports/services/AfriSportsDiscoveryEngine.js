import { ingestFromProvider } from "../../../modules/football/ingestion/FootballIngestionBoundary.js";
import { rankBigMatches } from "./FootballAnalyticsService.js";

const PROVIDER = "SportMonks";

function today() {
  return new Date().toISOString().split("T")[0];
}

function extractMatches(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.matches)) return result.matches;
  if (Array.isArray(result?.data)) return result.data;
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

export async function getLiveFeed() {
  const result = await ingestFromProvider(PROVIDER, "live");
  const matches = extractMatches(result);

  return {
    source: PROVIDER,
    type: "LIVE",
    count: matches.length,
    matches: rankBigMatches(matches)
  };
}

export async function getTodayFeed() {
  const targetDate = today();
  const result = await ingestFromProvider(PROVIDER, "fixtures", {
    date: targetDate,
    include: "participants;league;season"
  });

  const matches = filterMatchesByDate(extractMatches(result), targetDate);

  return {
    source: PROVIDER,
    type: "TODAY",
    date: today(),
    count: matches.length,
    matches: rankBigMatches(matches)
  };
}

export async function getDiscoveryFeed() {
  const result = await ingestFromProvider(PROVIDER, "fixtures", {
    date: today(),
    include: "participants;league;season"
  });

  const matches = filterMatchesByDate(extractMatches(result), today()).filter(match => {
    const league = match?.league?.name || "";

    return (
      league.includes("Women") ||
      league.includes("U19") ||
      league.includes("U20") ||
      league.includes("Youth") ||
      league.includes("Cup") ||
      league.includes("League")
    );
  });

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
