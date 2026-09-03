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

  const h2hHome=h2h.filter(match=>match?.result==="home").length;
  const h2hAway=h2h.filter(match=>match?.result==="away").length;
  const h2hEdge=h2h.length
    ?clamp((h2hHome-h2hAway)/h2h.length,-1,1)
    :0;

  const injuryHome=Array.isArray(signals.injuries?.home)?signals.injuries.home.length:0;
  const injuryAway=Array.isArray(signals.injuries?.away)?signals.injuries.away.length:0;
  const injuryEdge=clamp((injuryAway-injuryHome)/5,-1,1);

  const lineupHome=Boolean(signals.lineups?.home);
  const lineupAway=Boolean(signals.lineups?.away);
  const lineupEdge=
    lineupHome===lineupAway
      ?0
      :lineupHome
        ?1
        :-1;

  const providerPredictions=Array.isArray(signals.providerPredictions)
    ?signals.providerPredictions
    :[];

  const providerProbabilitySets=providerPredictions
    .map(item=>item?.probabilities)
    .filter(item=>
      Number.isFinite(Number(item?.home)) &&
      Number.isFinite(Number(item?.draw)) &&
      Number.isFinite(Number(item?.away))
    );

  const providerHomeProbability=providerProbabilitySets.length
    ?providerProbabilitySets.reduce((sum,item)=>sum+Number(item.home),0)/providerProbabilitySets.length
    :null;

  const providerDrawProbability=providerProbabilitySets.length
    ?providerProbabilitySets.reduce((sum,item)=>sum+Number(item.draw),0)/providerProbabilitySets.length
    :null;

  const providerAwayProbability=providerProbabilitySets.length
    ?providerProbabilitySets.reduce((sum,item)=>sum+Number(item.away),0)/providerProbabilitySets.length
    :null;

  const provider1x2Edge=providerHomeProbability!==null&&providerAwayProbability!==null
    ?clamp((providerHomeProbability-providerAwayProbability)/100,-1,1)
    :0;

  const providerGoalMarkets=providerPredictions
    .map(item=>item?.markets?.goals??item?.markets?.over_under??{})
    .filter(item=>item&&typeof item==="object");

  const providerOver25Values=providerGoalMarkets
    .map(item=>Number(item?.["2.5"]?.over))
    .filter(Number.isFinite);

  const providerOver25=providerOver25Values.length
    ?providerOver25Values.reduce((sum,value)=>sum+value,0)/providerOver25Values.length
    :null;

  const providerBttsValues=providerPredictions
    .map(item=>Number(item?.markets?.btts?.yes))
    .filter(Number.isFinite);

  const providerBttsYes=providerBttsValues.length
    ?providerBttsValues.reduce((sum,value)=>sum+value,0)/providerBttsValues.length
    :null;

  return Object.freeze({
    type:"AFRI_PREDICTION_FEATURE_VECTOR",
    positionEdge,
    formEdge,
    xgEdge,
    oddsEdge,
    h2hEdge,
    h2hCount:h2h.length,
    injuryEdge,
    injuryHomeCount:injuryHome,
    injuryAwayCount:injuryAway,
    lineupEdge,
    lineupHomeAvailable:lineupHome,
    lineupAwayAvailable:lineupAway,
    providerPredictionCount:providerPredictions.length,
    providerHomeProbability,
    providerDrawProbability,
    providerAwayProbability,
    provider1x2Edge,
    providerOver25,
    providerBttsYes,
    featureCount:20
  });
}

export default Object.freeze({fuse:fusePredictionFeatures});
