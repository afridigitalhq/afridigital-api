const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const avg=(a=[])=>a.length?a.reduce((s,v)=>s+Number(v||0),0)/a.length:0;

export function fusePredictionFeatures(signals={}){
  const formHome=avg(signals.form?.home);
  const formAway=avg(signals.form?.away);
  const h2h=Array.isArray(signals.h2h?.matches)?signals.h2h.matches:[];
  const xgHome=Number(signals.xg?.home??0);
  const xgAway=Number(signals.xg?.away??0);
  const oddsHome=Number(signals.odds?.home??0);
  const oddsDraw=Number(signals.odds?.draw??0);
  const oddsAway=Number(signals.odds?.away??0);
  const homePosition=Number(signals.homePosition??0);
  const awayPosition=Number(signals.awayPosition??0);
  const positionEdge=homePosition&&awayPosition?clamp((awayPosition-homePosition)/20,-1,1):0;
  const xgEdge=xgHome||xgAway?clamp((xgHome-xgAway)/4,-1,1):0;
  const formEdge=formHome||formAway?clamp((formHome-formAway)/5,-1,1):0;
  const oddsEdge=oddsHome&&oddsAway?clamp((oddsAway-oddsHome)/10,-1,1):0;
  return Object.freeze({
    type:"AFRI_PREDICTION_FEATURE_VECTOR",
    positionEdge,
    formEdge,
    xgEdge,
    oddsEdge,
    h2hCount:h2h.length,
    injuryHomeCount:Array.isArray(signals.injuries?.home)?signals.injuries.home.length:0,
    injuryAwayCount:Array.isArray(signals.injuries?.away)?signals.injuries.away.length:0,
    lineupHomeAvailable:Boolean(signals.lineups?.home),
    lineupAwayAvailable:Boolean(signals.lineups?.away),
    featureCount:9
  });
}

export default Object.freeze({fuse:fusePredictionFeatures});
