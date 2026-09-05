import AfriPredictionProviderRegistry from "../registry/AfriPredictionProviderRegistry.js";
import "./../providers/bootstrap.js";
import {createPredictionEvidenceFromFixture} from "../providers/AfriPredictionEvidenceAdapter.js";
import {predictFromEvidence} from "./AfriPredictionEvidenceEngine.js";
import {buildProviderConsensus} from "./AfriPredictionProviderConsensus.js";
export async function predictMatch(input={},options={}){const providers=options.providers||AfriPredictionProviderRegistry.all();const league=input.league??input.leagueName??null;const eligible=providers.filter(provider=>!provider?.scaffoldOnly&&(!options.requireLeagueCoverage||!league||provider.supportsLeague(league)));if(!eligible.length)throw new Error(`No prediction provider covers league "${league??"requested league"}"`);const selected=options.provider?eligible.filter(provider=>provider.name===options.provider):eligible.slice(0,options.maxProviders||10);const results=await Promise.allSettled(selected.map(provider=>provider.predictMatch(input)));const providerResults=results.map((result,index)=>({provider:selected[index].name,status:result.status,...(result.status==="fulfilled"?{result:result.value}:{error:result.reason?.message||"Provider failed"})}));const successful=providerResults.filter(item=>item.status==="fulfilled");if(!successful.length)throw new Error("No prediction provider returned a prediction");const primary=successful[0]?.result??{};
const fixture={
  id:input.fixtureId??input.id??input.matchId,
  league:input.league??primary.league??null,
  season:input.season??primary.season??null,
  homeTeam:input.homeTeam??primary.homeTeam??"Home",
  awayTeam:input.awayTeam??primary.awayTeam??"Away",
  homePosition:input.homePosition??null,
  awayPosition:input.awayPosition??null,
  homeForm:input.homeForm??[],
  awayForm:input.awayForm??[],
  homeGoalsFor:input.homeGoalsFor??null,
  homeGoalsAgainst:input.homeGoalsAgainst??null,
  awayGoalsFor:input.awayGoalsFor??null,
  awayGoalsAgainst:input.awayGoalsAgainst??null,
  providerPredictions:successful.map(item=>({
    provider:item.provider,
    probabilities:item.result?.probabilities??{},
    markets:item.result?.markets??{},
    expectedGoals:item.result?.expectedGoals??null,
    correctScore:item.result?.correctScore??null,
    metadata:item.result?.metadata??{}
  }))
};
const providerConsensus=buildProviderConsensus(providerResults);
const predictionEvidence=createPredictionEvidenceFromFixture({fixture,source:providerResults});
const prediction=predictFromEvidence(predictionEvidence);
return {
  ...prediction,
  league,
  providerCount:successful.length,
  providerConsensus,
  providerResults
}}
export default Object.freeze({predictMatch});
