import axios from "axios";

const BASE_URL = "https://v3.football.api-sports.io";

function getApiKey() {
  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {
    throw new Error("API_FOOTBALL_KEY is not configured");
  }

  return key.trim();
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json"
  }
});

export async function apiFootballRequest(endpoint, params = {}) {
  const response = await client.get(endpoint, {
    params,
    headers: {
      "x-apisports-key": getApiKey()
    }
  });

  return response.data;
}

export async function getApiFootballFixtures(params = {}) {
  return apiFootballRequest("/fixtures", params);
}

export async function getApiFootballFixture(fixtureId) {
  return apiFootballRequest("/fixtures", {
    id: fixtureId
  });
}

export async function getApiFootballLiveMatches() {
  return apiFootballRequest("/fixtures", {
    live: "all"
  });
}

export async function getApiFootballEvents(fixtureId) {
  return apiFootballRequest("/fixtures/events", {
    fixture: fixtureId
  });
}

export async function getApiFootballLineups(fixtureId) {
  return apiFootballRequest("/fixtures/lineups", {
    fixture: fixtureId
  });
}

export async function getApiFootballStandings(league, season) {
  return apiFootballRequest("/standings", {
    league,
    season
  });
}

export async function getApiFootballTopScorers(league, season) {
  return apiFootballRequest("/players/topscorers", {
    league,
    season
  });
}

export async function getApiFootballTeams(league, season) {
  return apiFootballRequest("/teams", {
    league,
    season
  });
}

export async function getApiFootballLeagues(params = {}) {
  return apiFootballRequest("/leagues", params);
}

export default {
  request: apiFootballRequest,
  getFixtures: getApiFootballFixtures,
  getFixture: getApiFootballFixture,
  getLive: getApiFootballLiveMatches,
  getEvents: getApiFootballEvents,
  getLineups: getApiFootballLineups,
  getStandings: getApiFootballStandings,
  getScorers: getApiFootballTopScorers,
  getTeams: getApiFootballTeams,
  getLeagues: getApiFootballLeagues
};
