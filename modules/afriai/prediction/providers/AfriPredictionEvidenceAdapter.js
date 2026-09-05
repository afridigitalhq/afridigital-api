import {createAfriPredictionEvidence} from "../contracts/AfriPredictionEvidenceContract.js";

export function createPredictionEvidenceFromFixture({fixture,source=null}={}) {
  if(!fixture) throw new Error("Fixture is required");

  return createAfriPredictionEvidence({
    fixtureId:fixture.id??fixture.fixtureId,
    league:fixture.league?.name??fixture.league??null,
    competition:fixture.competition?.name??fixture.competition??null,
    season:fixture.season?.name??fixture.season??null,
    homeTeam:fixture.home?.name??fixture.homeTeam??fixture.participants?.find(p=>p?.meta?.location==="home")?.name??"Home",
    awayTeam:fixture.away?.name??fixture.awayTeam??fixture.participants?.find(p=>p?.meta?.location==="away")?.name??"Away",
    homePosition:fixture.home?.meta?.position??fixture.home?.position??fixture.homePosition??fixture.participants?.find(p=>p?.meta?.location==="home")?.meta?.position??null,
    awayPosition:fixture.away?.meta?.position??fixture.away?.position??fixture.awayPosition??fixture.participants?.find(p=>p?.meta?.location==="away")?.meta?.position??null,
    homeForm:fixture.home?.form??fixture.homeForm??[],
    awayForm:fixture.away?.form??fixture.awayForm??[],
    homeGoalsFor:fixture.home?.goalsFor??fixture.homeGoalsFor??null,
    homeGoalsAgainst:fixture.home?.goalsAgainst??fixture.homeGoalsAgainst??null,
    awayGoalsFor:fixture.away?.goalsFor??fixture.awayGoalsFor??null,
    awayGoalsAgainst:fixture.away?.goalsAgainst??fixture.awayGoalsAgainst??null,
    h2h:fixture.h2h??[],
    injuries:fixture.injuries??{home:[],away:[]},
    lineups:fixture.lineups??{home:null,away:null},
    xg:fixture.xg??{home:null,away:null},
    odds:fixture.odds??{home:null,draw:null,away:null},
    providerPredictions:fixture.providerPredictions??[],
    liveState:fixture.liveState??null,
    source,
    metadata:{providerFixtureId:fixture.id??fixture.fixtureId}
  });
}
