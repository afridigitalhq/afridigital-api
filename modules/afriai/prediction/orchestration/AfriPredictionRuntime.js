import {canUsePrediction} from "../contracts/AfriPredictionEntitlementContract.js";
import {resolvePredictionMarkets} from "./AfriPredictionMarketResolver.js";
import AfriPredictionProviderRegistry from "../registry/AfriPredictionProviderRegistry.js";
import {inspectPredictionProviders} from "../registry/AfriPredictionProviderHealth.js";

export async function runAfriPrediction({request,entitlement={mode:"free"},markets=[]}={}) {
  if (!request?.fixtureId) throw new Error("Prediction request is required");
  if (!canUsePrediction(entitlement)) throw new Error("Prediction entitlement denied");

  const marketResolution=resolvePredictionMarkets({
    requested:markets,
    entitlement
  });

  const providers=AfriPredictionProviderRegistry.all();
  const health=await inspectPredictionProviders(providers);
  const available=providers.filter(provider =>
    health.find(item=>item.provider===provider.name)?.available
  );

  return Object.freeze({
    type:"AFRI_PREDICTION_RUNTIME",
    request,
    entitlement,
    markets:marketResolution,
    providers:Object.freeze(available.map(provider=>provider.name)),
    status:available.length?"READY":"NO_PROVIDER"
  });
}

export default Object.freeze({run:runAfriPrediction});
