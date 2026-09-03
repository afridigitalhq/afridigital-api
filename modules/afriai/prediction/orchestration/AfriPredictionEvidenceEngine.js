import { normalizePredictionSignals } from "./AfriPredictionSignalNormalizer.js";
import { fusePredictionFeatures } from "./AfriPredictionFeatureFusion.js";
import { predictMatch } from "./AfriPredictionModel.js";

export function predictFromEvidence(evidence = {}) {
  if (evidence?.type !== "AFRI_PREDICTION_EVIDENCE") {
    throw new Error("Valid Afri prediction evidence is required");
  }

  const signals = normalizePredictionSignals(evidence);
  const features = fusePredictionFeatures(signals);

  const prediction = predictMatch({
    homeTeam: signals.homeTeam,
    awayTeam: signals.awayTeam,
    homePosition: signals.homePosition,
    awayPosition: signals.awayPosition,
    homeAdvantage: signals.homeAdvantage,
    features
  });

  return Object.freeze({
    type: "AFRI_PREDICTION",
    fixtureId: signals.fixtureId,
    league: signals.league,
    competition: signals.competition,
    season: signals.season,
    prediction: prediction.prediction,
    probabilities: prediction.probabilities,
    expectedGoals: prediction.expectedGoals,
    homeXg: prediction.homeXg,
    awayXg: prediction.awayXg,
    correctScore: prediction.correctScore,
    correctScoreProbability: prediction.correctScoreProbability,
    markets: prediction.markets,
    predictions: prediction.predictions,
    confidence: prediction.confidence,
    model: prediction.model,
    features,
    evidenceSource: signals.source
  });
}

export default Object.freeze({ predict: predictFromEvidence });
