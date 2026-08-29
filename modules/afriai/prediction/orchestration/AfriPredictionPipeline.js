import {createPredictionEvidenceFromFixture} from "../providers/AfriPredictionEvidenceAdapter.js";
import {predictFromEvidence} from "./AfriPredictionEvidenceEngine.js";

export function runPredictionPipeline({fixture,source=null}={}){
  const evidence=createPredictionEvidenceFromFixture({fixture,source});
  const prediction=predictFromEvidence(evidence);
  return Object.freeze({
    type:"AFRI_PREDICTION_PIPELINE",
    evidence,
    prediction,
    status:"PASS"
  });
}

export default Object.freeze({run:runPredictionPipeline});
