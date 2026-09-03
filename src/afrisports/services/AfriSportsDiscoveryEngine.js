import { ingestFromProvider } from "../../../modules/football/ingestion/FootballIngestionBoundary.js";
import { resolveCompetition, resolveCompetitionForProvider } from "../../../modules/football/orchestration/FootballCompetitionResolver.js";
import { rankBigMatches } from "./FootballAnalyticsService.js";
import { resolveSportMonksSeason } from "../../../modules/football/providers/SportMonksSeasonResolver.js";
import { apiFootballFetch } from "../../../modules/apifootball/APIfootballClient.js";

const PROVIDER = "APIfootball";

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

function filterMatchesByDate(matches = [], date, options = {}) {
  const target = String(date ?? "").slice(0, 10);
  if (!target) return [];

  const now = options.now ? new Date(options.now) : new Date();

  return matches.filter(match => {
    const kickoff = match?.kickoff ?? match?.starting_at ?? null;
    if (!kickoff || String(kickoff).slice(0, 10) !== target) return false;

    const status = String(
      match?.status?.short ??
      match?.status ??
      match?.state?.short ??
      match?.state?.name ??
      ""
    ).toUpperCase();

    if (["FT", "AET", "PEN", "CANCELLED", "CANCELED", "POSTP", "POSTPONED", "ABD", "ABANDONED"].includes(status)) {
      return false;
    }

    const kickoffDate = new Date(String(kickoff).replace(" ", "T") + "Z");

    if (Number.isFinite(kickoffDate.getTime()) && kickoffDate <= now && !["LIVE", "1H", "2H", "ET", "HT", "INPLAY", "IN_PLAY"].includes(status)) {
      return false;
    }

    return true;
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
  const result = await ingestFromProvider(PROVIDER, "live");

  const liveStatuses = new Set([
    "LIVE",
    "1H",
    "2H",
    "HT",
    "ET",
    "INPLAY",
    "IN_PLAY",
    "EXTRA_TIME"
  ]);

  const matches = extractMatches(result)
    .filter(match => {
      const status = String(
        match?.status?.short ??
        match?.status?.name ??
        match?.status ??
        match?.state?.short ??
        match?.state?.name ??
        ""
      ).toUpperCase().replace(/[-\s]/g, "_");

      return liveStatuses.has(status);
    })
    .map(match => ({
    ...match,
    competitionKey: match?.metadata?.providerLeagueId
      ? `${String(match?.metadata?.provider || PROVIDER).toLowerCase()}:${match.metadata.providerLeagueId}`
      : String(match?.metadata?.provider || PROVIDER).toLowerCase(),
    competitionProvider: PROVIDER,
    competitionName:
      match?.league?.name ||
      match?.league?.title ||
      match?.metadata?.providerPayload?.league?.name ||
      match?.league ||
      "SportMonks"
  }));

  return {
    source: "AfriSports",
    type: "LIVE",
    count: matches.length,
    matches: rankBigMatches(matches)
  };
}
async function getPriorityFixtures(date) {
  const results = await Promise.all(PRIORITY_COMPETITIONS.map(async competitionKey => {
    const resolved = resolvePrimaryCompetition(competitionKey);
    const result = await ingestFromProvider(resolved.provider, "fixtures", {
      date,
      leagueId: resolved.leagueId,
      ...(resolved.seasonId ? { seasonId: resolved.seasonId } : {})
    });
    return extractMatches(result).map(match => ({
      ...match,
      competitionKey,
      competitionProvider: resolved.provider,
      competitionName:
        match?.league?.name ||
        match?.league?.title ||
        resolved.competitionKey
    }));
  }));
  return results.flat();
}
export async function getTodayFeed() {
  const date = new Date().toISOString().slice(0, 10);
  const result = await ingestFromProvider(PROVIDER, "fixtures", { date });
  const matches = extractMatches(result).map(match => ({
    ...match,
    competitionKey: match?.metadata?.providerLeagueId
      ? String(match?.metadata?.provider || PROVIDER).toLowerCase() + ":" + match.metadata.providerLeagueId
      : String(match?.metadata?.provider || PROVIDER).toLowerCase(),
    competitionProvider: PROVIDER
  }));
  return {
    source: "AfriSports",
    type: "TODAY",
    count: matches.length,
    matches: rankBigMatches(matches)
  };
}

export async function getTomorrowFeed() {
  const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const result = await ingestFromProvider(PROVIDER, "fixtures", { date });
  const matches = extractMatches(result).map(match => ({
    ...match,
    competitionKey: match?.metadata?.providerLeagueId
      ? String(match?.metadata?.provider || PROVIDER).toLowerCase() + ":" + match.metadata.providerLeagueId
      : String(match?.metadata?.provider || PROVIDER).toLowerCase(),
    competitionProvider: PROVIDER
  }));
  return {
    source: "AfriSports",
    type: "TOMORROW",
    count: matches.length,
    matches: rankBigMatches(matches)
  };
}

export async function getDiscoveryFeed() {
  const today = await getTodayFeed();
  return {
    source: "AfriSports",
    type: "DISCOVERY",
    count: today.count,
    matches: today.matches
  };
}

export async function getAllCompetitions() {
  const leagues = await apiFootballFetch({ action: "get_leagues" });
  const rows = Array.isArray(leagues) ? leagues : [];
  const seen = new Set();
  const competitions = [];

  for (const league of rows) {
    const id = league?.league_id ?? null;
    const name = league?.league_name ?? null;
    if (id == null || !name) continue;

    const key = String(id);
    if (seen.has(key)) continue;
    seen.add(key);

    competitions.push({
      id: key,
      name,
      country: league?.country_name ?? null,
      countryId: league?.country_id ?? null,
      logo: league?.league_logo ?? null,
      season: league?.league_year ?? null,
      provider: "APIfootball"
    });
  }

  return {
    source: "AfriSports",
    type: "ALL_COMPETITIONS",
    count: competitions.length,
    competitions
  };
}

export async function getFeaturedFeed() {
  const today = await getTodayFeed();
  return {
    source: "AfriSports",
    type: "FEATURED",
    count: today.count,
    matches: today.matches.slice(0, 20)
  };
}

