function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function normalize(home,draw,away){const total=home+draw+away;return{home:Number((home/total*100).toFixed(2)),draw:Number((draw/total*100).toFixed(2)),away:Number((away/total*100).toFixed(2))}}
function factorial(n){return n<=1?1:n*factorial(n-1)}
function poisson(lambda,goals){return Math.exp(-lambda)*Math.pow(lambda,goals)/factorial(goals)}
function overUnderMarkets(expectedGoals){const lines=[1.5,2.5,3.5,4.5,5.5];return Object.freeze(Object.fromEntries(lines.map(line=>{const threshold=Math.floor(line);let under=0;for(let goals=0;goals<=threshold;goals++)under+=poisson(expectedGoals,goals);const underPct=Number((under*100).toFixed(2));return [String(line),Object.freeze({goalLine:line,over:Number((100-underPct).toFixed(2)),under:underPct})]})))}

export function predictMatch({homeTeam="Home",awayTeam="Away",homePosition=null,awayPosition=null,homeAdvantage=7}={}){
  const positionSignal=homePosition&&awayPosition?clamp((awayPosition-homePosition)*1.8,-18,18):0;
  const probabilities=normalize(
    clamp(46+homeAdvantage+positionSignal,15,75),
    23,
    clamp(31-positionSignal,15,70)
  );
  const expectedGoals=Number((2.15+Math.max(0,positionSignal)*0.015).toFixed(2));
  const homeXg=Number((expectedGoals*(probabilities.home/Math.max(probabilities.home+probabilities.away,1))).toFixed(2));
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
  const prediction=correctScore.home>correctScore.away?"home":correctScore.home<correctScore.away?"away":"draw";
  return Object.freeze({
    homeTeam,
    awayTeam,
    prediction,
    probabilities,
    expectedGoals,
    homeXg,
    awayXg,
    correctScore:`${correctScore.home}-${correctScore.away}`,
    markets:{over_under:overUnderMarkets(expectedGoals)},
    confidence:clamp(Math.round(Math.max(probabilities.home,probabilities.draw,probabilities.away)*0.82),50,85),
    model:"AfriAI Prediction Model v1"
  });
}
