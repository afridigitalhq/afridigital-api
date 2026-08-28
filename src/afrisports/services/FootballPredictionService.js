import { getFixtures, getStandings } from "./FootballMatchEngine.js";

function teamPosition(standings = [], teamId, teamName) {
  const rows = Array.isArray(standings?.data) ? standings.data : Array.isArray(standings) ? standings : [];
  const row = rows.find(item => String(item?.participant_id ?? item?.team_id ?? item?.participant?.id ?? item?.team?.id ?? "") === String(teamId)) || rows.find(item => String(item?.participant?.name ?? item?.team?.name ?? item?.name ?? "").toLowerCase() === String(teamName ?? "").toLowerCase());
  return Number(row?.position ?? row?.rank ?? row?.meta?.position ?? 0) || 0;
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function normalizeProbabilities(home, draw, away) {
  const total = home + draw + away;
  return { home: Math.round(home / total * 100), draw: Math.round(draw / total * 100), away: Math.round(away / total * 100) };
}

export async function getMatchPrediction(fixtureId, date) {
  const fixtures = await getFixtures(date);
  const rows = Array.isArray(fixtures?.data) ? fixtures.data : Array.isArray(fixtures) ? fixtures : [];
  const match = rows.find(item => String(item?.id) === String(fixtureId));
  if (!match) throw new Error(`AfriSports fixture ${fixtureId} was not found for ${date || "the requested date"}`);
  const leagueId = match?.league?.id ?? match?.metadata?.providerLeagueId ?? null;
  const seasonId = match?.season?.id ?? match?.metadata?.providerSeasonId ?? null;
  let standings = { data: [] };
  if (leagueId || seasonId) { try { standings = await getStandings(leagueId, seasonId); } catch {} }
  const homeId = match?.home?.id ?? null;
  const awayId = match?.away?.id ?? null;
  const homeName = match?.home?.name ?? "Home";
  const awayName = match?.away?.name ?? "Away";
  const homePosition = teamPosition(standings, homeId, homeName);
  const awayPosition = teamPosition(standings, awayId, awayName);
  const positionSignal = homePosition && awayPosition ? clamp((awayPosition - homePosition) * 1.8, -18, 18) : 0;
  const homeAdvantage = 7;
  const baseHome = 46 + homeAdvantage + positionSignal;
  const baseAway = 31 - positionSignal;
  const baseDraw = 23;
  const probabilities = normalizeProbabilities(clamp(baseHome, 15, 75), clamp(baseDraw, 12, 35), clamp(baseAway, 15, 70));
  const winner = probabilities.home >= probabilities.away && probabilities.home >= probabilities.draw ? homeName : probabilities.away >= probabilities.home && probabilities.away >= probabilities.draw ? awayName : "Draw";
  const expectedGoals = Number((2.15 + Math.max(0, positionSignal) * 0.015).toFixed(2));
  const confidence = clamp(Math.round(Math.max(probabilities.home, probabilities.away, probabilities.draw) * 0.82), 50, 85);
  const factors = [];
  factors.push("Home advantage");
  if (homePosition && awayPosition) factors.push(`${homeName} position ${homePosition} vs ${awayName} position ${awayPosition}`);
  else factors.push("League-table position data unavailable; baseline model applied");
  factors.push(`Competition: ${match?.league?.name ?? "Football"}`);
  return {
    fixtureId: match.id,
    match: `${homeName} vs ${awayName}`,
    kickoff: match.kickoff,
    competition: match?.league?.name ?? "Football",
    model: "AfriAI Sports Prediction v1",
    probabilities,
    prediction: winner,
    expectedGoals,
    confidence,
    factors,
    disclaimer: "Prediction is statistical analysis, not a guarantee of the match result.",
    source: "SportMonks"
  };
}
