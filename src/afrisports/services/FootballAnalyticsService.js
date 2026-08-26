export function calculateMatchImportance(match){

  const league = match?.league?.name || "";
  const home = match?.teams?.home?.name || "";
  const away = match?.teams?.away?.name || "";

  let score = 40;

  const eliteLeagues = [
    "Premier League",
    "Champions League",
    "UEFA",
    "Libertadores",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1"
  ];

  if(eliteLeagues.some(x=>league.includes(x))){
    score += 40;
  }

  const famousTeams=[
    "Real Madrid",
    "Barcelona",
    "Manchester",
    "Liverpool",
    "Arsenal",
    "Bayern",
    "PSG",
    "Juventus",
    "Inter",
    "Milan"
  ];

  if(famousTeams.some(x=>home.includes(x)||away.includes(x))){
    score += 20;
  }

  return Math.min(score,100);
}


export function rankBigMatches(fixtures=[]){

  return fixtures
    .map(match=>({
      ...match,
      afriSportsScore:calculateMatchImportance(match)
    }))
    .sort(
      (a,b)=>b.afriSportsScore-a.afriSportsScore
    );
}
