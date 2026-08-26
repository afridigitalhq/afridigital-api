import { footballRequest } from "./ApiFootballClient.js";
import { rankBigMatches } from "./FootballAnalyticsService.js";

function today(){
  return new Date().toISOString().split("T")[0];
}

export async function getBigMatches(){

  const fixtures = [];

  try {
    const todayFeed = await footballRequest("/fixtures", {
      date: today()
    });

    console.log("TODAY RESULTS:", todayFeed.results);

    fixtures.push(...(todayFeed.response || []));

  } catch(error){
    console.log("TODAY RADAR ERROR:");
    console.log(error.response?.data || error.message);
  }


  try {
    const live = await footballRequest("/fixtures", {
      live:"all"
    });

    console.log("LIVE RESULTS:", live.results);

    fixtures.push(...(live.response || []));

  } catch(error){
    console.log("LIVE RADAR ERROR:");
    console.log(error.response?.data || error.message);
  }


  const unique = Array.from(
    new Map(
      fixtures.map(match=>[
        match.fixture.id,
        match
      ])
    ).values()
  );


  const ranked = rankBigMatches(unique);

  return {
    source:"API-Football",
    date:today(),
    count:ranked.length,
    matches:ranked
  };
}
