import { getLiveFeed, getTodayFeed } from "./AfriSportsDiscoveryEngine.js";
import { rankBigMatches } from "./FootballAnalyticsService.js";

function boostMatch(match){
  let score = match.afriSportsScore || 0;

  const status = match?.fixture?.status?.short || "";
  const homeGoals = match?.goals?.home ?? 0;
  const awayGoals = match?.goals?.away ?? 0;

  if(["1H","2H","ET"].includes(status)){
    score += 20;
  }

  if(Math.abs(homeGoals - awayGoals) <= 1){
    score += 15;
  }

  if(match.events?.length){
    score += 10;
  }

  return Math.min(score,100);
}

export async function getTrendingMatches(){

  const [live,today] = await Promise.all([
    getLiveFeed(),
    getTodayFeed()
  ]);

  const combined = [
    ...(live.matches || []),
    ...(today.matches || [])
  ];

  const unique = Array.from(
    new Map(
      combined.map(match=>[
        match.fixture.id,
        match
      ])
    ).values()
  );

  const ranked = rankBigMatches(unique)
    .map(match=>({
      ...match,
      afriTrendingScore:boostMatch(match)
    }))
    .sort(
      (a,b)=>b.afriTrendingScore-a.afriTrendingScore
    );

  return {
    source:"AfriAI Match Radar",
    type:"TRENDING",
    count:ranked.length,
    matches:ranked.slice(0,20)
  };
}
