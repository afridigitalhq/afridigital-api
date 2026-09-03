function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

function average(values){
  const valid=values.filter(value=>value!==null&&value!==undefined&&value!==""&&Number.isFinite(Number(value))).map(Number);
  return valid.length?valid.reduce((sum,value)=>sum+value,0)/valid.length:null;
}

function mergeMarketObjects(values=[]){
 const result={};
 for(const value of values.filter(item=>item&&typeof item==="object")){
  for(const [key,entry] of Object.entries(value)){
   if(entry&&typeof entry==="object"&&!Array.isArray(entry)) result[key]={...result[key],...entry};
   else result[key]=entry;
  }
 }
 return result;
}

function buildPredictions({probabilities,markets}){
 const predictions=[];
 for(const [selection,probability] of [["Home",probabilities.home],["Draw",probabilities.draw],["Away",probabilities.away]]) predictions.push({type:"match_prediction",market:"1X2",selection,probability});
 for(const [line,market] of Object.entries(markets.over_under||{})){
  if(Number.isFinite(Number(market?.over))) predictions.push({type:"over_under",market:line,selection:"Over",probability:Number(market.over)});
  if(Number.isFinite(Number(market?.under))) predictions.push({type:"over_under",market:line,selection:"Under",probability:Number(market.under)});
 }
 if(Number.isFinite(Number(markets.btts?.yes))) predictions.push({type:"btts",market:"BTTS",selection:"Yes",probability:Number(markets.btts.yes)});
 if(Number.isFinite(Number(markets.btts?.no))) predictions.push({type:"btts",market:"BTTS",selection:"No",probability:Number(markets.btts.no)});
 for(const [selection,probability] of [["Home or Draw",markets.double_chance?.homeOrDraw],["Away or Draw",markets.double_chance?.awayOrDraw],["Home or Away",markets.double_chance?.homeOrAway]]) if(Number.isFinite(Number(probability))) predictions.push({type:"double_chance",market:"Double Chance",selection,probability:Number(probability)});
 for(const [selection,probability] of Object.entries(markets.handicap||{})) if(Number.isFinite(Number(probability))) predictions.push({type:"handicap",market:"Asian Handicap",selection,probability:Number(probability)});
 return predictions;
}

function normalizePrediction(result){
  const prediction=result?.result??result??{};
  const probabilities=prediction.probabilities??{};
  return {
    provider:result?.provider??prediction.provider??"unknown",
    prediction:prediction.prediction??prediction.outcome??null,
    probabilities:{
      home:Number(probabilities.home??prediction.homeProbability??0),
      draw:Number(probabilities.draw??prediction.drawProbability??0),
      away:Number(probabilities.away??prediction.awayProbability??0)
    },
    correctScore:prediction.correctScore??null,
    correctScoreProbability:Number(prediction.correctScoreProbability??0),
    expectedGoals:prediction.expectedGoals===null||prediction.expectedGoals===undefined||prediction.expectedGoals===""?null:Number(prediction.expectedGoals),
   markets:{
     over_under:prediction.markets?.over_under??prediction.markets?.goals??{},
     btts:prediction.markets?.btts??{},
     double_chance:prediction.markets?.double_chance??prediction.markets?.doubleChance??{},
     handicap:prediction.markets?.handicap??{}
   }
  };
}

export function fusePredictions(results=[]){
  const successful=results
    .filter(result=>result?.status==="fulfilled"||result?.result)
    .map(normalizePrediction);

  if(!successful.length){
    throw new Error("No successful Afri prediction provider results available");
  }

  const home=average(successful.map(item=>item.probabilities.home))??0;
  const draw=average(successful.map(item=>item.probabilities.draw))??0;
  const away=average(successful.map(item=>item.probabilities.away))??0;
  const total=home+draw+away||1;

  const probabilities={
    home:Number((home/total*100).toFixed(1)),
    draw:Number((draw/total*100).toFixed(1)),
    away:Number((away/total*100).toFixed(1))
  };

  const prediction=
    probabilities.home>=probabilities.draw&&probabilities.home>=probabilities.away
      ? "home"
      : probabilities.away>=probabilities.home&&probabilities.away>=probabilities.draw
        ? "away"
        : "draw";

  const correctScores=successful
    .filter(item=>item.correctScore)
    .map(item=>item.correctScore);

  const scoreCounts=new Map();
  for(const score of correctScores){
    scoreCounts.set(score,(scoreCounts.get(score)||0)+1);
  }

  const correctScore=[...scoreCounts.entries()]
    .sort((a,b)=>b[1]-a[1])[0]?.[0]??null;

  const expectedGoals=average(successful.map(item=>item.expectedGoals));
 const markets={
  over_under:mergeMarketObjects(successful.map(item=>item.markets?.over_under)),
  btts:mergeMarketObjects(successful.map(item=>item.markets?.btts)),
  double_chance:mergeMarketObjects(successful.map(item=>item.markets?.double_chance)),
  handicap:mergeMarketObjects(successful.map(item=>item.markets?.handicap))
 };
 const predictions=buildPredictions({probabilities,markets});

  return {
    type:"AFRI_AI_FUSED_PREDICTION",
    providerCount:successful.length,
    providers:successful.map(item=>item.provider),
    prediction,
    probabilities,
    correctScore,
    expectedGoals:expectedGoals===null?null:Number(expectedGoals.toFixed(2)),
   markets,
   predictions,
    confidence:clamp(
      Math.round(Math.max(probabilities.home,probabilities.draw,probabilities.away)),
      0,
      95
    ),
    methodology:"Multi-provider statistical prediction fusion"
  };
}

export default Object.freeze({fusePredictions});
