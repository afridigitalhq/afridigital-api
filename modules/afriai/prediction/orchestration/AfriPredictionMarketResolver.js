import {AFRI_PREDICTION_MARKETS} from "../contracts/AfriPredictionContract.js";

export function resolvePredictionMarkets({requested=[],entitlement={}}={}) {
  const available=Array.isArray(entitlement.markets)&&entitlement.markets.length
    ? entitlement.markets.filter(m=>AFRI_PREDICTION_MARKETS.includes(m))
    : AFRI_PREDICTION_MARKETS;
  const selected=Array.isArray(requested)&&requested.length
    ? requested.filter(m=>available.includes(m))
    : available;
  return Object.freeze({available:Object.freeze(available),selected:Object.freeze(selected)});
}

export default Object.freeze({resolve:resolvePredictionMarkets});
