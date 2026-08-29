import {predictMatch} from "./AfriPredictionModel.js";

export function predictFromEvidence(evidence={}){if(evidence?.type!=="AFRI_PREDICTION_EVIDENCE")throw new Error("Valid Afri prediction evidence is required");const prediction=predictMatch({homeTeam:evidence.homeTeam,awayTeam:evidence.awayTeam,homePosition:evidence.homePosition,awayPosition:evidence.awayPosition,homeAdvantage:evidence.homeAdvantage});return Object.freeze({type:"AFRI_PREDICTION",fixtureId:evidence.fixtureId,league:evidence.league,competition:evidence.competition,season:evidence.season,prediction:prediction.prediction,probabilities:prediction.probabilities,expectedGoals:prediction.expectedGoals,homeXg:prediction.homeXg,awayXg:prediction.awayXg,correctScore:prediction.correctScore,markets:prediction.markets,confidence:prediction.confidence,model:prediction.model,evidenceSource:evidence.source})}

export default Object.freeze({predict:predictFromEvidence});
