function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function normalize(home,draw,away){const total=home+draw+away;return{home:Number((home/total*100).toFixed(2)),draw:Number((draw/total*100).toFixed(2)),away:Number((away/total*100).toFixed(2))}}
function factorial(n){return n<=1?1:n*factorial(n-1)}
function poisson(lambda,goals){return Math.exp(-lambda)*Math.pow(lambda,goals)/factorial(goals)}

function buildScorelineMatrix(homeXg,awayXg,targetProbabilities){
  const scorelines=[];

  for(let homeGoals=0;homeGoals<=10;homeGoals++){
    for(let awayGoals=0;awayGoals<=10;awayGoals++){
      scorelines.push({
        home:homeGoals,
        away:awayGoals,
        probability:
          poisson(homeXg,homeGoals)*
          poisson(awayXg,awayGoals)
      });
    }
  }

  /*
   * First normalize the raw Poisson distribution.
   */
  const rawTotal=scorelines.reduce(
    (sum,item)=>sum+item.probability,
    0
  )||1;

  for(const item of scorelines){
    item.probability/=rawTotal;
  }

  /*
   * Calibrate the scoreline matrix to the final 1X2
   * probabilities. This makes:
   *
   *   Home scorelines = Home probability
   *   Draw scorelines = Draw probability
   *   Away scorelines = Away probability
   *
   * while preserving the relative Poisson likelihood of
   * individual scorelines inside each outcome group.
   */
  const groups={
    home:[],
    draw:[],
    away:[]
  };

  for(const item of scorelines){
    if(item.home>item.away) groups.home.push(item);
    else if(item.home===item.away) groups.draw.push(item);
    else groups.away.push(item);
  }

  const targets={
    home:Number(targetProbabilities.home||0)/100,
    draw:Number(targetProbabilities.draw||0)/100,
    away:Number(targetProbabilities.away||0)/100
  };

  for(const [name,items] of Object.entries(groups)){
    const total=items.reduce((sum,item)=>sum+item.probability,0)||1;
    const multiplier=targets[name]/total;

    for(const item of items){
      item.probability*=multiplier;
    }
  }

  const total=scorelines.reduce(
    (sum,item)=>sum+item.probability,
    0
  )||1;

  for(const item of scorelines){
    item.probability/=total;
  }

  return scorelines;
}

function matrixExpectedGoals(scorelines){
  return scorelines.reduce(
    (sum,item)=>
      sum+
      (item.home+item.away)*item.probability,
    0
  );
}

function matrixOverUnder(scorelines,line){
  const threshold=Math.floor(Number(line));

  let under=0;

  for(const item of scorelines){
    if(item.home+item.away<=threshold){
      under+=item.probability;
    }
  }

  const underPct=Number((under*100).toFixed(2));

  return {
    goalLine:Number(line),
    over:Number((100-underPct).toFixed(2)),
    under:underPct
  };
}

function matrixBtts(scorelines){
  let yes=0;

  for(const item of scorelines){
    if(item.home>0&&item.away>0){
      yes+=item.probability;
    }
  }

  const yesPct=Number((yes*100).toFixed(2));

  return {
    yes:yesPct,
    no:Number((100-yesPct).toFixed(2))
  };
}

function matrixDoubleChance(scorelines){
  let homeOrDraw=0;
  let awayOrDraw=0;
  let homeOrAway=0;

  for(const item of scorelines){
    if(item.home>=item.away) homeOrDraw+=item.probability;
    if(item.away>=item.home) awayOrDraw+=item.probability;
    if(item.home!==item.away) homeOrAway+=item.probability;
  }

  return {
    homeOrDraw:Number((homeOrDraw*100).toFixed(2)),
    awayOrDraw:Number((awayOrDraw*100).toFixed(2)),
    homeOrAway:Number((homeOrAway*100).toFixed(2))
  };
}

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
  /*
   * Provider 1X2 probabilities are evidence, not a directional
   * feature to be multiplied into the old Home-biased baseline.
   *
   * The previous implementation converted an 81% provider Away
   * probability into a small edge and then fed it into a hard-coded
   * Home baseline. That could turn very strong provider evidence
   * into an artificially weak AfriAI prediction.
   *
   * AfriAI now:
   *   1. builds its own statistical baseline from football signals;
   *   2. keeps provider probabilities intact;
   *   3. explicitly fuses the two probability distributions.
   */

  const evidenceSignal=clamp(
    Number(features.positionEdge||0)*8+
    Number(features.formEdge||0)*7+
    Number(features.xgEdge||0)*9+
    Number(features.oddsEdge||0)*5+
    Number(features.h2hEdge||0)*4+
    Number(features.injuryEdge||0)*3+
    Number(features.lineupEdge||0)*2,
    -20,
    20
  );

  /*
   * No football evidence should not manufacture a strong Home
   * prediction. Home advantage is retained as a modest prior,
   * while actual evidence/provider probabilities carry the
   * decision.
   */
  /*
   * Evidence-first baseline:
   * Do not manufacture a Home advantage when fixture evidence is
   * unavailable. Home-field advantage must come from supplied,
   * measurable evidence rather than a hard-coded prior.
   */
  const baselineEdge=clamp(
    positionSignal+evidenceSignal,
    -35,
    35
  );

  const baselineProbabilities=normalize(
    clamp(33.33+baselineEdge,5,90),
    clamp(33.33-Math.abs(baselineEdge)*0.15,5,60),
    clamp(33.33-baselineEdge,5,90)
  );

  const providerProbabilities={
    home:Number(features.providerHomeProbability),
    draw:Number(features.providerDrawProbability),
    away:Number(features.providerAwayProbability)
  };

  const hasProvider1X2=
    Number.isFinite(providerProbabilities.home) &&
    Number.isFinite(providerProbabilities.draw) &&
    Number.isFinite(providerProbabilities.away) &&
    providerProbabilities.home>=0 &&
    providerProbabilities.draw>=0 &&
    providerProbabilities.away>=0 &&
    providerProbabilities.home+
      providerProbabilities.draw+
      providerProbabilities.away>0;

  /*
   * Evidence-weighted provider fusion:
   * A neutral AfriAI baseline must not dilute a strong provider
   * prediction when AfriAI has no independent directional evidence.
   * With one provider and a neutral baseline, preserve the provider
   * evidence. Additional independent AfriAI evidence can be blended
   * later through explicit calibrated weights.
   */
  const baselineIsNeutral=
    Math.abs(baselineProbabilities.home-33.33)<0.01 &&
    Math.abs(baselineProbabilities.draw-33.33)<0.01 &&
    Math.abs(baselineProbabilities.away-33.33)<0.01;

  const providerWeight=hasProvider1X2
    ?baselineIsNeutral
      ?1
      :Number(features.providerPredictionCount||0)>1
        ?0.75
        :0.70
    :0;

  const probabilities=hasProvider1X2
    ?normalize(
        baselineProbabilities.home*(1-providerWeight)+providerProbabilities.home*providerWeight,
        baselineProbabilities.draw*(1-providerWeight)+providerProbabilities.draw*providerWeight,
        baselineProbabilities.away*(1-providerWeight)+providerProbabilities.away*providerWeight
      )
    :baselineProbabilities;
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
    (expectedGoals*(
      probabilities.home/
      Math.max(probabilities.home+probabilities.away,1)
    )).toFixed(2)
  );

  const awayXg=Number(
    (expectedGoals-homeXg).toFixed(2)
  );

  /*
   * ONE source of truth:
   *
   * The calibrated scoreline matrix now feeds:
   *   - 1X2
   *   - Correct Score
   *   - Over/Under
   *   - BTTS
   *   - Double Chance
   *
   * This prevents independent markets from contradicting
   * the selected correct score.
   */
  const scorelines=buildScorelineMatrix(
    homeXg,
    awayXg,
    probabilities
  );

  const correctScore=scorelines
    .slice()
    .sort((a,b)=>b.probability-a.probability)[0];

  const matrixProbabilities={
    home:Number((
      scorelines
        .filter(item=>item.home>item.away)
        .reduce((sum,item)=>sum+item.probability,0)*100
    ).toFixed(2)),
    draw:Number((
      scorelines
        .filter(item=>item.home===item.away)
        .reduce((sum,item)=>sum+item.probability,0)*100
    ).toFixed(2)),
    away:Number((
      scorelines
        .filter(item=>item.home<item.away)
        .reduce((sum,item)=>sum+item.probability,0)*100
    ).toFixed(2))
  };

  const outcomeOptions=[
    ["home",probabilities.home],
    ["draw",probabilities.draw],
    ["away",probabilities.away]
  ];

  const prediction=outcomeOptions
    .sort((a,b)=>b[1]-a[1])[0][0];

  const lines=[1.5,2.5,3.5,4.5,5.5];

  const overUnder=Object.freeze(
    Object.fromEntries(
      lines.map(line=>[
        String(line),
        Object.freeze(matrixOverUnder(scorelines,line))
      ])
    )
  );

  const btts=Object.freeze(
    matrixBtts(scorelines)
  );

  const doubleChance=Object.freeze(
    matrixDoubleChance(scorelines)
  );

  const correctScoreProbability=correctScore.probability;

  /*
   * Expected goals is now calculated from the same calibrated
   * scoreline matrix used by every market.
   */
  const coherentExpectedGoals=Number(
    matrixExpectedGoals(scorelines).toFixed(2)
  );

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

  /*
   * Coherence diagnostics are deliberately advisory.
   * They expose conflicts without silently changing provider evidence.
   */
  const selectedCorrectScoreTotalGoals=
    correctScore.home+correctScore.away;

  const correctScoreGoalSide=
    selectedCorrectScoreTotalGoals>=2
      ?"over"
      :"under";

  const modelOver15=overUnder["1.5"]?.over??null;

  const matrix1x2MatchesFinal=
    Math.abs(matrixProbabilities.home-probabilities.home)<0.05 &&
    Math.abs(matrixProbabilities.draw-probabilities.draw)<0.05 &&
    Math.abs(matrixProbabilities.away-probabilities.away)<0.05;

  const coherence={
    providerEvidenceAvailable:hasProvider1X2,
    providerWeight,
    provider1x2:hasProvider1X2
      ?Object.freeze({
          home:providerProbabilities.home,
          draw:providerProbabilities.draw,
          away:providerProbabilities.away
        })
      :null,
    baseline1x2:Object.freeze({
      home:baselineProbabilities.home,
      draw:baselineProbabilities.draw,
      away:baselineProbabilities.away
    }),
    final1x2:Object.freeze({
      home:probabilities.home,
      draw:probabilities.draw,
      away:probabilities.away
    }),
    matrix1x2:Object.freeze({
      home:matrixProbabilities.home,
      draw:matrixProbabilities.draw,
      away:matrixProbabilities.away
    }),
    matrix1x2MatchesFinal,
    correctScoreGoalSide,
    correctScoreCompatibleWithOver15:null,
    scorelineMatrixIsSourceOfTruth:true
  };

  return Object.freeze({
    homeTeam,
    awayTeam,
    prediction,
    probabilities,
    expectedGoals:coherentExpectedGoals,
    providerGoalLambda:providerGoalLambda===null
      ?null
      :Number(providerGoalLambda.toFixed(2)),
    homeXg,
    awayXg,
    correctScore:`${correctScore.home}-${correctScore.away}`,
    correctScoreProbability:Number((correctScoreProbability*100).toFixed(2)),
    markets,
    predictions,
    confidence:clamp(
      Math.round(
        Math.max(
          probabilities.home,
          probabilities.draw,
          probabilities.away
        )
      ),
      50,
      95
    ),
    coherence,
    model:"AfriAI Prediction Model v2"
  });
}
