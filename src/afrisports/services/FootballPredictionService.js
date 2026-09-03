import {predictMatch} from "../../../modules/afriai/prediction/orchestration/AfriPredictionOrchestrator.js";

export async function getMatchPrediction(fixtureId,date,fixture={}){
  if(!fixtureId)throw new Error("Fixture ID is required");

  const result=await predictMatch(
    {
      ...fixture,
      fixtureId
    },
    {provider:"APIfootball"}
  );

  return {
    ...result,
    fixtureId,
    pipeline:"AFRI_AI_PREDICTION_ORCHESTRATOR",
    date:date??fixture?.kickoff?.slice?.(0,10)??null
  };
}

export default Object.freeze({getMatchPrediction});
