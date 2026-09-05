export function createAfriPredictionEvidence({
  fixtureId,
  league=null,
  competition=null,
  season=null,
  homeTeam,
  awayTeam,
  homePosition=null,
  awayPosition=null,
  homeForm=[],
  awayForm=[],
  homeGoalsFor=null,
  homeGoalsAgainst=null,
  awayGoalsFor=null,
  awayGoalsAgainst=null,
  homeAdvantage=7,
  h2h=[],
  injuries={home:[],away:[]},
  lineups={home:null,away:null},
  xg={home:null,away:null},
  odds={home:null,draw:null,away:null},
  providerPredictions=[],
  source=null,
  metadata={},
  liveState=null
}={}) {
  if(!fixtureId) throw new Error("Prediction evidence fixtureId is required");
  if(!homeTeam||!awayTeam) throw new Error("Prediction evidence requires both teams");

  return Object.freeze({
    type:"AFRI_PREDICTION_EVIDENCE",
    fixtureId:String(fixtureId),
    league,
    competition:competition??league,
    season,
    homeTeam,
    awayTeam,
    homePosition,
    awayPosition,
    homeForm:Object.freeze([...homeForm]),
    awayForm:Object.freeze([...awayForm]),
    homeGoalsFor,
    homeGoalsAgainst,
    awayGoalsFor,
    awayGoalsAgainst,
    homeAdvantage,
    h2h:Object.freeze([...h2h]),
    injuries:Object.freeze({
      home:Object.freeze([...(injuries?.home??[])]),
      away:Object.freeze([...(injuries?.away??[])])
    }),
    lineups:Object.freeze({
      home:lineups?.home??null,
      away:lineups?.away??null
    }),
    xg:Object.freeze({
      home:xg?.home??null,
      away:xg?.away??null
    }),
    odds:Object.freeze({
      home:odds?.home??null,
      draw:odds?.draw??null,
      away:odds?.away??null
    }),
    providerPredictions:Object.freeze(
      (Array.isArray(providerPredictions)?providerPredictions:[]).map(item=>Object.freeze({
        provider:item?.provider??null,
        probabilities:Object.freeze({...item?.probabilities}),
        markets:Object.freeze({...item?.markets}),
        expectedGoals:item?.expectedGoals??null,
        correctScore:item?.correctScore??null,
        metadata:Object.freeze({...item?.metadata})
      }))
    ),
    source,
    liveState: liveState ? Object.freeze({
      status: liveState.status ?? null,
      minute: liveState.minute ?? null,
      score: Object.freeze({
        home: liveState.score?.home ?? null,
        away: liveState.score?.away ?? null
      }),
      events:Object.freeze([...(liveState.events ?? [])]),
      metadata:Object.freeze({...liveState.metadata})
    }) : null,
    metadata:Object.freeze({...metadata})
  });
}
