import "dotenv/config";

const BASE_URL = "https://api.sportmonks.com/v3/football";

function getToken() {
  const token = process.env.SPORTMONKS_API_TOKEN;
  if (!token) throw new Error("SPORTMONKS_API_TOKEN is not configured");
  return token.trim();
}

export async function sportMonksFetch(path, options = {}) {
  const token = getToken();
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
      Authorization: token
    }
  });

  const text = await response.text();
  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }

  if (!response.ok) {
    const error = new Error(
      body?.message || `SportMonks request failed with HTTP ${response.status}`
    );
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

export async function getSportMonksLeague(leagueId) {
  return sportMonksFetch(`/leagues/${leagueId}`);
}

export async function getSportMonksFixture(fixtureId, include = "participants;league;season") {
  const query = include ? `?include=${encodeURIComponent(include)}` : "";
  return sportMonksFetch(`/fixtures/${fixtureId}${query}`);
}

export async function getSportMonksFixtures(options = {}) {
  const params = new URLSearchParams();

  if (options.page) params.set("page", String(options.page));
  if (options.perPage) params.set("per_page", String(options.perPage));
  if (options.leagueId) params.set("league_id", String(options.leagueId));
  if (options.seasonId) params.set("season_id", String(options.seasonId));
  if (options.include) params.set("include", options.include);

  const date = options.date ? String(options.date).trim() : null;
  const query = params.toString();

  if (options.seasonId && !date) {
    const path = `/schedules/seasons/${encodeURIComponent(String(options.seasonId))}`;

    if (process.env.AFRISPORTS_DEBUG_REQUESTS === "true") {
      console.log("SPORTMONKS_FIXTURES_REQUEST:", path);
    }

    const result = await sportMonksFetch(path);
    const stages = Array.isArray(result?.data) ? result.data : [];
    const fixtures = stages.flatMap(stage =>
      Array.isArray(stage?.rounds)
        ? stage.rounds.flatMap(round =>
            Array.isArray(round?.fixtures) ? round.fixtures : []
          )
        : []
    );

    return {
      ...result,
      data: fixtures
    };
  }

  const path = date
    ? `/fixtures/date/${encodeURIComponent(date)}${query ? `?${query}` : ""}`
    : `/fixtures${query ? `?${query}` : ""}`;

  if (process.env.AFRISPORTS_DEBUG_REQUESTS === "true") {
    console.log("SPORTMONKS_FIXTURES_REQUEST:", path);
  }

  return sportMonksFetch(path);
}

export default {
  fetch: sportMonksFetch,
  getLeague: getSportMonksLeague,
  getFixture: getSportMonksFixture,
  getFixtures: getSportMonksFixtures
};
