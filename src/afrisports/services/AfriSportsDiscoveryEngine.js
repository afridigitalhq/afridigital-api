import { footballRequest } from "./ApiFootballClient.js";
import { rankBigMatches } from "./FootballAnalyticsService.js";

function today(){
  return new Date().toISOString().split("T")[0];
}

export async function getLiveFeed(){
  const data = await footballRequest("/fixtures",{
    live:"all"
  });

  if (data?.errors && Object.keys(data.errors).length) {
    return {
      source:"API-Football",
      type:"LIVE",
      count:0,
      matches:[],
      providerStatus:"UNAVAILABLE",
      providerError:data.errors
    };
  }

  return {
    source:"API-Football",
    type:"LIVE",
    count:data.response?.length || 0,
    matches:rankBigMatches(data.response || [])
  };
}

export async function getTodayFeed(){
  const data = await footballRequest("/fixtures",{
    date:today()
  });

  return {
    source:"API-Football",
    type:"TODAY",
    date:today(),
    count:data.response?.length || 0,
    matches:rankBigMatches(data.response || [])
  };
}

export async function getDiscoveryFeed(){
  const data = await footballRequest("/fixtures",{
    date:today()
  });

  const matches = (data.response || []).filter(match=>{
    const league = match?.league?.name || "";

    return (
      league.includes("Women") ||
      league.includes("U19") ||
      league.includes("U20") ||
      league.includes("Youth") ||
      league.includes("Cup") ||
      league.includes("League")
    );
  });

  return {
    source:"API-Football",
    type:"DISCOVERY",
    count:matches.length,
    matches:rankBigMatches(matches)
  };
}

export async function getFeaturedFeed(){
  const todayFeed = await getTodayFeed();

  return {
    source:"AfriAI Match Radar",
    type:"FEATURED",
    count:todayFeed.matches.length,
    matches:todayFeed.matches.slice(0,20)
  };
}
