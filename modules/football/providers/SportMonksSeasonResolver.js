import { getSportMonksLeague } from "../../sportmonks/SportMonksClient.js";

const cache = new Map();

function extractSeason(league) {
  const seasons = Array.isArray(league?.seasons) ? league.seasons : [];
  if (!seasons.length) return null;

  const active =
    seasons.find(season =>
      season?.active === true ||
      season?.is_current === true ||
      season?.current === true
    ) ||
    seasons
      .filter(season => season?.name || season?.starting_at)
      .sort((a, b) =>
        String(b?.starting_at || "").localeCompare(
          String(a?.starting_at || "")
        )
      )[0];

  return active?.id ?? null;
}

export async function resolveSportMonksSeason(leagueId) {
  if (!leagueId) return null;

  const key = String(leagueId);
  if (cache.has(key)) return cache.get(key);

  const result = await getSportMonksLeague(leagueId);
  const seasonId = extractSeason(result?.data ?? result);

  if (seasonId) cache.set(key, seasonId);

  return seasonId;
}

export function clearSportMonksSeasonCache() {
  cache.clear();
}

export default {
  resolveSportMonksSeason,
  clearSportMonksSeasonCache
};
