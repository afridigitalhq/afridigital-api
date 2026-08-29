import {normalizePredictionSignals} from "./AfriPredictionSignalNormalizer.js";
import {predictMatch} from "./AfriPredictionModel.js";

export function predictFromSignals(evidence={}){
  const signals=normalizePredictionSignals(evidence);
  const prediction=predictMatch({
    homeTeam:signals.homeTeam,
    awayTeam:signals.awayTeam,
    homePosition:signals.homePosition,
    awayPosition:signals.awayPosition,
    homeAdvantage:signals.homeAdvantage
  });
  return Object.freeze({
    type:"AFRI_PREDICTION",
    fixtureId:signals.fixtureId,
    league:signals.league,
    competition:signals.competition,
    season:signals.season,
    prediction:prediction.prediction,
    probabilities:prediction.probabilities,
    expectedGoals:prediction.expectedGoals,
    homeXg:prediction.homeXg,
    awayXg:prediction.awayXg,
    correctScore:prediction.correctScore,
    confidence:prediction.confidence,
    model:prediction.model,
    evidenceSource:signals.source,
    signalCount:Object.keys(signals).length
  });
}

export default Object.freeze({predict:predictFromSignals});
