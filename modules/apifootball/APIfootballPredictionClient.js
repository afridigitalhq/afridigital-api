import { apiFootballFetch } from "./APIfootballClient.js";

function number(value) {
  if (value === undefined || value === null || value === "") return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

export async function getApiFootballPredictions(options = {}) {
  const data = await apiFootballFetch({
    action: "get_predictions",
    ...options
  });

  return Array.isArray(data)
    ? data.map(prediction => ({
        provider: "APIfootball",
        matchId: prediction.match_id ?? null,
        leagueId: prediction.league_id ?? null,
        leagueName: prediction.league_name ?? null,
        date: prediction.match_date ?? null,
        homeTeam: prediction.match_hometeam_name ?? null,
        awayTeam: prediction.match_awayteam_name ?? null,
        probabilities: {
          homeWin: number(prediction.prob_HW),
          draw: number(prediction.prob_D),
          awayWin: number(prediction.prob_AW),
          homeOrDraw: number(prediction.prob_HW_D),
          awayOrDraw: number(prediction.prob_AW_D),
          homeOrAway: number(prediction.prob_HW_AW)
        },
        goals: Object.fromEntries(
          [
            ["2.5", { over: number(prediction.prob_O), under: number(prediction.prob_U) }],
            ["1.5", { over: number(prediction.prob_O_1), under: number(prediction.prob_U_1) }],
            ["3.5", { over: number(prediction.prob_O_3), under: number(prediction.prob_U_3) }]
          ].filter(([, market]) => market.over !== null || market.under !== null)
        ),
        btts: {
          yes: number(prediction.prob_bts),
          no: number(prediction.prob_ots)
        },
        doubleChance: {
          homeOrDraw: number(prediction.prob_HW_D),
          awayOrDraw: number(prediction.prob_AW_D),
          homeOrAway: number(prediction.prob_HW_AW)
        },
        handicap: Object.fromEntries(
          Object.entries(prediction)
            .filter(([key]) => /^prob_ah_(h|a)_-?\\d+$/.test(key))
            .map(([key, value]) => [key, number(value)])
        ),
        raw: prediction
      }))
    : [];
}

export default Object.freeze({
  getPredictions: getApiFootballPredictions
});
