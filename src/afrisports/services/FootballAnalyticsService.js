export function calculateMatchImportance(match = {}) {
  const league =
    match?.league?.name ||
    match?.metadata?.providerPayload?.league?.name ||
    "";

  const home =
    match?.home?.name ||
    match?.home?.short_code ||
    match?.metadata?.providerPayload?.participants?.find(
      participant => participant?.meta?.location === "home"
    )?.name ||
    "";

  const away =
    match?.away?.name ||
    match?.away?.short_code ||
    match?.metadata?.providerPayload?.participants?.find(
      participant => participant?.meta?.location === "away"
    )?.name ||
    "";

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

  if (eliteLeagues.some(name => league.includes(name))) {
    score += 40;
  }

  const famousTeams = [
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

  if (famousTeams.some(name => home.includes(name) || away.includes(name))) {
    score += 20;
  }

  return Math.min(score, 100);
}

export function rankBigMatches(fixtures = []) {
  return fixtures
    .map(match => ({
      ...match,
      afriSportsScore: calculateMatchImportance(match)
    }))
    .sort((a, b) => b.afriSportsScore - a.afriSportsScore);
}
