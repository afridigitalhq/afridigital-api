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

export async function getBigMatches() {
  const result = await ingestFromProvider(
    PROVIDER,
    "fixtures",
    {
      include: "participants;league;season"
    }
  );

  const matches = extractMatches(result);

  const ranked = rankBigMatches(matches);

  return {
    source: PROVIDER,
    date: today(),
    count: ranked.length,
    matches: ranked
  };
}
