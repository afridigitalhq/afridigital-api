import "dotenv/config";
import axios from "axios";
import dnsPromises from "node:dns/promises";
import https from "node:https";

const BASE_URL = "https://apiv3.apifootball.com/";

const apiFootballLookup = async (hostname, options, callback) => {
  try {
    const addresses = await dnsPromises.resolve4(hostname);

    if (options?.all) {
      callback(
        null,
        addresses.map(address => ({ address, family: 4 }))
      );
      return;
    }

    callback(null, addresses[0], 4);
  } catch (error) {
    callback(error);
  }
};

const apiFootballHttpsAgent = new https.Agent({
  lookup: apiFootballLookup
});

function getApiFootballKey() {
  const key = process.env.APIFOOTBALL_API_KEY;

  if (!key) {
    throw new Error("APIFOOTBALL_API_KEY is not configured");
  }

  return key;
}

export async function apiFootballFetch(params = {}) {
  const url = new URL(BASE_URL);

  url.searchParams.set("APIkey", getApiFootballKey());

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await axios.get(url, {
    httpsAgent: apiFootballHttpsAgent,
    validateStatus: () => true
  });

  const payload = response.data;

  if (
    !payload ||
    (typeof payload !== "object" && !Array.isArray(payload))
  ) {
    throw new Error(
      `APIfootball.com returned non-JSON response (${response.status})`
    );
  }

  if (response.status < 200 || response.status >= 300) {
    if (response.status === 404 && params.action === "get_events") {
      return [];
    }
    throw new Error(
      `APIfootball.com request failed (${response.status}): ${JSON.stringify(payload)}`
    );
  }

  if (
    payload &&
    !Array.isArray(payload) &&
    typeof payload === "object" &&
    payload.error
  ) {
    if (
      params.action === "get_events" &&
      [201, 404].includes(Number(payload.error))
    ) {
      return [];
    }
    throw new Error(
      `APIfootball.com error: ${JSON.stringify(payload.error)}`
    );
  }

  return payload;
}

export async function getApiFootballLeagues(countryId = null) {
  return apiFootballFetch({
    action: "get_leagues",
    ...(countryId ? { country_id: countryId } : {})
  });
}

export async function getApiFootballEvents(options = {}) {
  return apiFootballFetch({
    action: "get_events",
    ...options
  });
}

export default Object.freeze({
  fetch: apiFootballFetch,
  getLeagues: getApiFootballLeagues,
  getEvents: getApiFootballEvents
});
