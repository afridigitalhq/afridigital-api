import { createAfriPredictionProviderContract } from "../contracts/AfriPredictionProviderContract.js";
import { createAfriPrediction } from "../contracts/AfriPredictionContract.js";
import { getApiFootballPredictions } from "../../../apifootball/APIfootballPredictionClient.js";

function outcome(probabilities) {
  const home = Number(probabilities.home ?? 0);
  const draw = Number(probabilities.draw ?? 0);
  const away = Number(probabilities.away ?? 0);
  if (home >= draw && home >= away) return "home";
  if (away >= home && away >= draw) return "away";
  return "draw";
}

async function predictMatch(input = {}) {
  const fixtureId = input.fixtureId ?? input.id ?? input.matchId;
  if (!fixtureId) throw new Error("APIfootball prediction requires fixtureId");

  const predictions = await getApiFootballPredictions({
    match_id: fixtureId,
    ...(input.leagueId != null ? { league_id: input.leagueId } : {})
  });

  const prediction = predictions.find(
    item => String(item.matchId) === String(fixtureId)
  ) ?? predictions[0];

  if (!prediction) {
    throw new Error(`APIfootball prediction unavailable for fixture "${fixtureId}"`);
  }

  const probabilities = {
    home: prediction.probabilities.homeWin,
    draw: prediction.probabilities.draw,
    away: prediction.probabilities.awayWin
  };

  return createAfriPrediction({
    fixtureId: prediction.matchId,
    league: prediction.leagueName,
    season: input.season ?? null,
    homeTeam: prediction.homeTeam,
    awayTeam: prediction.awayTeam,
    provider: "APIfootball",
    prediction: outcome(probabilities),
    probabilities,
    correctScore: null,
    expectedGoals: null,
    markets: {
      goals: prediction.goals,
      btts: prediction.btts,
      handicap: prediction.handicap
    },
    metadata: {
      provider: "APIfootball",
      providerLeagueId: prediction.leagueId,
      source: "APIfootballPredictionClient",
      raw: prediction.raw
    }
  });
}

const APIfootballPredictionProvider = createAfriPredictionProviderContract({
  name: "APIfootball",
  capabilities: [
    "match_prediction",
    "probabilities",
    "over_under",
    "goals",
    "btts"
  ],
  coverage: "global",
  predictMatch
});

export default APIfootballPredictionProvider;
