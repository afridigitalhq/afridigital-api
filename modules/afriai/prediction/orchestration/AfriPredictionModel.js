function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function normalize(home,draw,away){const total=home+draw+away;return{home:Number((home/total*100).toFixed(2)),draw:Number((draw/total*100).toFixed(2)),away:Number((away/total*100).toFixed(2))}}
function factorial(n){return n<=1?1:n*factorial(n-1)}
function poisson(lambda,goals){return Math.exp(-lambda)*Math.pow(lambda,goals)/factorial(goals)}

function impliedPoissonLambda(overProbability,goalLine){
  const target=clamp(Number(overProbability)/100,0.0001,0.9999);
  const threshold=Math.floor(Number(goalLine));
  let low=0;
  let high=10;

  for(let iteration=0;iteration<60;iteration++){
    const mid=(low+high)/2;
    let under=0;

    for(let goals=0;goals<=threshold;goals++){
      under+=poisson(mid,goals);
    }

    const over=1-under;

    if(over<target) low=mid;
    else high=mid;
  }

  return (low+high)/2;
}
function overUnderMarkets(expectedGoals){
  const lines=[1.5,2.5,3.5,4.5,5.5];

  return Object.freeze(
    Object.fromEntries(
      lines.map(line=>{
        const threshold=Math.floor(line);
        let under=0;

        for(let goals=0;goals<=threshold;goals++){
          under+=poisson(expectedGoals,goals);
        }

        const underPct=Number((under*100).toFixed(2));
        const overPct=Number((100-underPct).toFixed(2));

        return [
          String(line),
          Object.freeze({
            goalLine:line,
            over:overPct,
            under:underPct
          })
        ];
      })
    )
  );
}

function bttsMarket(homeXg,awayXg){
  const yes=Number(
    (((1-Math.exp(-homeXg))*(1-Math.exp(-awayXg)))*100).toFixed(2)
  );

  return Object.freeze({
    yes,
    no:Number((100-yes).toFixed(2))
  });
}

function doubleChanceMarket(probabilities){
  return Object.freeze({
    homeOrDraw:Number((probabilities.home+probabilities.draw).toFixed(2)),
    awayOrDraw:Number((probabilities.away+probabilities.draw).toFixed(2)),
    homeOrAway:Number((probabilities.home+probabilities.away).toFixed(2))
  });
}

function buildSelectedPredictions({
  probabilities,
  overUnder,
  btts,
  doubleChance,
  correctScore,
  correctScoreProbability
}){
  const predictions=[];

  const matchOptions=[
    ["Home",probabilities.home],
    ["Draw",probabilities.draw],
    ["Away",probabilities.away]
  ];

  const selectedMatch=matchOptions
    .sort((a,b)=>b[1]-a[1])[0];

  predictions.push({
    type:"match_prediction",
    market:"1X2",
    selection:selectedMatch[0],
    probability:selectedMatch[1]
  });

  for(const [line,market] of Object.entries(overUnder)){
    const selected =
      Number(market.over)>=Number(market.under)
        ? ["Over",market.over]
        : ["Under",market.under];

    predictions.push({
      type:"over_under",
      market:line,
      selection:selected[0],
      probability:Number(selected[1])
    });
  }

  const selectedBtts =
    btts.yes>=btts.no
      ? ["Yes",btts.yes]
      : ["No",btts.no];

  predictions.push({
    type:"btts",
    market:"BTTS",
    selection:selectedBtts[0],
    probability:Number(selectedBtts[1])
  });

  const doubleChanceOptions=[
    ["Home or Draw",doubleChance.homeOrDraw],
    ["Away or Draw",doubleChance.awayOrDraw],
    ["Home or Away",doubleChance.homeOrAway]
  ];

  const selectedDoubleChance=doubleChanceOptions
    .sort((a,b)=>b[1]-a[1])[0];

  predictions.push({
    type:"double_chance",
    market:"Double Chance",
    selection:selectedDoubleChance[0],
    probability:Number(selectedDoubleChance[1])
  });

  if(correctScore){
    predictions.push({
      type:"correct_score",
      market:"Correct Score",
      selection:`${correctScore.home}-${correctScore.away}`,
      probability:Number((correctScoreProbability*100).toFixed(2))
    });
  }

  return Object.freeze(predictions);
}

export function predictMatch({homeTeam="Home",awayTeam="Away",homePosition=null,awayPosition=null,homeAdvantage=7,features={}}={}){
  const positionSignal=homePosition&&awayPosition?clamp((awayPosition-homePosition)*1.8,-18,18):0;
  const providerEvidenceSignal=Number(features.provider1x2Edge||0)*24;

  const evidenceSignal=clamp(
    Number(features.positionEdge||0)*8+
    Number(features.formEdge||0)*7+
    Number(features.xgEdge||0)*9+
    Number(features.oddsEdge||0)*5+
    Number(features.h2hEdge||0)*4+
    Number(features.injuryEdge||0)*3+
    Number(features.lineupEdge||0)*2+
    providerEvidenceSignal,
    -20,
    20
  );
  const probabilities=normalize(
    clamp(46+homeAdvantage+positionSignal+evidenceSignal,15,75),
    23,
    clamp(31-positionSignal-evidenceSignal,15,70)
  );
  const providerGoalMarkets=[
    ["1.5",features.providerOver15],
    ["2.5",features.providerOver25],
    ["3.5",features.providerOver35]
  ];

  const providerGoalLambdas=providerGoalMarkets
    .filter(([,value])=>Number.isFinite(Number(value)))
    .map(([line,value])=>impliedPoissonLambda(Number(value),Number(line)));

  const providerGoalLambda=providerGoalLambdas.length
    ?providerGoalLambdas.reduce((sum,value)=>sum+value,0)/providerGoalLambdas.length
    :null;

  const afriAiBaselineGoals=
    2.15+
    Math.max(0,positionSignal)*0.015;

  const fusedGoalRate=providerGoalLambda!==null
    ?afriAiBaselineGoals*0.5+providerGoalLambda*0.5
    :afriAiBaselineGoals;

  const expectedGoals=Number(
    clamp(
      fusedGoalRate,
      0.8,
      4.5
    ).toFixed(2)
  );

  const homeXg=Number(
    (expectedGoals*(probabilities.home/Math.max(probabilities.home+probabilities.away,1))).toFixed(2)
  );
  const awayXg=Number((expectedGoals-homeXg).toFixed(2));
  const scorelines=[];
  for(let homeGoals=0;homeGoals<=5;homeGoals++){
    for(let awayGoals=0;awayGoals<=5;awayGoals++){
      scorelines.push({
        home:homeGoals,
        away:awayGoals,
        probability:poisson(homeXg,homeGoals)*poisson(awayXg,awayGoals)
      });
    }
  }
  const correctScore=scorelines.sort((a,b)=>b.probability-a.probability)[0];

  const outcomeOptions=[
    ["home",probabilities.home],
    ["draw",probabilities.draw],
    ["away",probabilities.away]
  ];

  const prediction=outcomeOptions
    .sort((a,b)=>b[1]-a[1])[0][0];

  const overUnder=overUnderMarkets(expectedGoals);

  const baseBtts=bttsMarket(homeXg,awayXg);
  const providerBttsYes=Number(features.providerBttsYes);
  const btts=Number.isFinite(providerBttsYes)
    ?Object.freeze({
        yes:Number(clamp(
          baseBtts.yes*0.65+
          providerBttsYes*0.35,
          0,
          100
        ).toFixed(2)),
        no:Number(clamp(
          100-(
            baseBtts.yes*0.65+
            providerBttsYes*0.35
          ),
          0,
          100
        ).toFixed(2))
      })
    :baseBtts;

  const doubleChance=doubleChanceMarket(probabilities);

  const correctScoreProbability=correctScore.probability;

  const markets={
    over_under:overUnder,
    btts,
    double_chance:doubleChance
  };

  const predictions=buildSelectedPredictions({
    probabilities,
    overUnder,
    btts,
    doubleChance,
    correctScore,
    correctScoreProbability
  });

  return Object.freeze({
    homeTeam,
    awayTeam,
    prediction,
    probabilities,
    expectedGoals,
    providerGoalLambda:providerGoalLambda===null
      ?null
      :Number(providerGoalLambda.toFixed(2)),
    homeXg,
    awayXg,
    correctScore:`${correctScore.home}-${correctScore.away}`,
    correctScoreProbability:Number((correctScoreProbability*100).toFixed(2)),
    markets,
    predictions,
    confidence:clamp(Math.round(Math.max(probabilities.home,probabilities.draw,probabilities.away)*0.82),50,85),
    model:"AfriAI Prediction Model v1"
  });
}
