import { footballRequest } from "./ApiFootballClient.js";

export async function getFixtures(date){
  return footballRequest("/fixtures",{date});
}

export async function getLiveMatches(){
  return footballRequest("/fixtures",{live:"all"});
}

export async function getLeagueFixtures(league,season){
  return footballRequest("/fixtures",{
    league,
    season
  });
}

export async function getMatchEvents(fixture){
  return footballRequest("/fixtures/events",{fixture});
}

export async function getLineups(fixture){
  return footballRequest("/fixtures/lineups",{fixture});
}

export async function getStandings(league,season){
  return footballRequest("/standings",{
    league,
    season
  });
}

export async function getTopScorers(league,season){
  return footballRequest("/players/topscorers",{
    league,
    season
  });
}

export async function getTeams(league,season){
  return footballRequest("/teams",{
    league,
    season
  });
}
