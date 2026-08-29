const numberOrNull=value=>Number.isFinite(Number(value))?Number(value):null;
const arrayOrEmpty=value=>Array.isArray(value)?value:[];

export function normalizePredictionSignals(evidence={}){
  if(evidence?.type!=="AFRI_PREDICTION_EVIDENCE")throw new Error("Valid Afri prediction evidence is required");
  return Object.freeze({
    fixtureId:evidence.fixtureId??null,
    league:evidence.league??null,
    competition:evidence.competition??null,
    season:evidence.season??null,
    homeTeam:evidence.homeTeam??"Home",
    awayTeam:evidence.awayTeam??"Away",
    homePosition:numberOrNull(evidence.homePosition),
    awayPosition:numberOrNull(evidence.awayPosition),
    homeForm:arrayOrEmpty(evidence.homeForm),
    awayForm:arrayOrEmpty(evidence.awayForm),
    homeGoalsFor:numberOrNull(evidence.homeGoalsFor),
    homeGoalsAgainst:numberOrNull(evidence.homeGoalsAgainst),
    awayGoalsFor:numberOrNull(evidence.awayGoalsFor),
    awayGoalsAgainst:numberOrNull(evidence.awayGoalsAgainst),
    homeAdvantage:numberOrNull(evidence.homeAdvantage),
    h2h:arrayOrEmpty(evidence.h2h),
    injuries:{home:arrayOrEmpty(evidence.injuries?.home),away:arrayOrEmpty(evidence.injuries?.away)},
    lineups:{home:evidence.lineups?.home??null,away:evidence.lineups?.away??null},
    xg:{home:numberOrNull(evidence.xg?.home),away:numberOrNull(evidence.xg?.away)},
    odds:{home:numberOrNull(evidence.odds?.home),draw:numberOrNull(evidence.odds?.draw),away:numberOrNull(evidence.odds?.away)},
    source:evidence.source??null
  });
}

export default Object.freeze({normalize:normalizePredictionSignals});
