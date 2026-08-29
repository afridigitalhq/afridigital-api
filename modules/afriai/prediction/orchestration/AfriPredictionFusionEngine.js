function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

function average(values){
  const valid=values.filter(value=>Number.isFinite(Number(value))).map(Number);
  return valid.length?valid.reduce((sum,value)=>sum+value,0)/valid.length:null;
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
    expectedGoals:Number(prediction.expectedGoals??0)
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

  return {
    type:"AFRI_AI_FUSED_PREDICTION",
    providerCount:successful.length,
    providers:successful.map(item=>item.provider),
    prediction,
    probabilities,
    correctScore,
    expectedGoals:expectedGoals===null?null:Number(expectedGoals.toFixed(2)),
    confidence:clamp(
      Math.round(Math.max(probabilities.home,probabilities.draw,probabilities.away)),
      50,
      95
    ),
    methodology:"Multi-provider statistical prediction fusion"
  };
}

export default Object.freeze({fusePredictions});
