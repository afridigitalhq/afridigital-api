import { createRequire } from "module";
import { getLiveFeed, getTodayFeed } from "./AfriSportsDiscoveryEngine.js";
import { getMatchEvents } from "./FootballMatchEngine.js";
import { rankBigMatches } from "./FootballAnalyticsService.js";

const require = createRequire(import.meta.url);
const { get } = require("../../../bootstrap/ws-integration/output/ws-registry.cjs");

function publishAfriSports(event, payload) {
  const bridge = get("stream.bridge");
  if (bridge?.broadcast) {
    bridge.broadcast({
      source: "AfriSports",
      event,
      ...payload
    });
  }
}

function getMatchId(match) {
  return (
    match?.id ??
    match?.metadata?.providerMatchId ??
    match?.metadata?.providerPayload?.id ??
    null
  );
}

function getStatus(match) {
  const status = match?.status;

  if (typeof status === "string") return status;

  return String(
    match?.metadata?.providerPayload?.state?.short ||
    match?.metadata?.providerPayload?.state?.name ||
    ""
  );
}

function getGoals(match) {
  const resultInfo = String(match?.score || "");

  const home =
    match?.home_score ??
    match?.score?.home ??
    match?.metadata?.providerPayload?.scores?.localteam_score ??
    0;

  const away =
    match?.away_score ??
    match?.score?.away ??
    match?.metadata?.providerPayload?.scores?.visitorteam_score ??
    0;

  return {
    home: Number.isFinite(Number(home)) ? Number(home) : 0,
    away: Number.isFinite(Number(away)) ? Number(away) : 0,
    resultInfo
  };
}

function boostMatch(match) {
  let score = match?.afriSportsScore || 0;
  const status = getStatus(match);
  const goals = getGoals(match);

  if (["1H", "2H", "ET", "LIVE", "INPLAY"].includes(status)) {
    score += 20;
  }

  if (Math.abs(goals.home - goals.away) <= 1) {
    score += 15;
  }

  if (Array.isArray(match?.events) && match.events.length) {
    score += 10;
  }

  return Math.min(score, 100);
}

export async function getTrendingMatches() {
  const [live, today] = await Promise.all([
    getLiveFeed(),
    getTodayFeed()
  ]);

  const providerError =
    live?.providerError ||
    today?.providerError;

  if (providerError) {
    const error = new Error("AfriSports provider unavailable");
    error.code = "AFRISPORTS_PROVIDER_ERROR";
    error.providerError = providerError;
    throw error;
  }

  const combined = [
    ...(live?.matches || []),
    ...(today?.matches || [])
  ];

  const unique = Array.from(
    new Map(
      combined
        .map(match => [getMatchId(match), match])
        .filter(([id]) => id !== null)
    ).values()
  );

  const ranked = rankBigMatches(unique)
    .map(match => ({
      ...match,
      afriTrendingScore: boostMatch(match)
    }))
    .sort(
      (a, b) => b.afriTrendingScore - a.afriTrendingScore
    );

  const topMatches = ranked.slice(0, 20);

  const enrichedMatches = await Promise.all(
    topMatches.map(async match => {
      const fixtureId = getMatchId(match);

      if (fixtureId === null) {
        return {
          ...match,
          events: []
        };
      }

      try {
        const eventResult = await getMatchEvents(fixtureId);
        const events = Array.isArray(eventResult?.data)
          ? eventResult.data
          : Array.isArray(eventResult)
            ? eventResult
            : [];

        return {
          ...match,
          events
        };
      } catch (error) {
        console.warn(
          "AfriSports event enrichment failed:",
          fixtureId,
          error?.message || error
        );

        return {
          ...match,
          events: []
        };
      }
    })
  );

  const result = {
    source: "AfriAI Match Radar",
    type: "TRENDING",
    count: enrichedMatches.length,
    matches: enrichedMatches
  };

  publishAfriSports("trending.update", result);

  return result;
}
