export const FOOTBALL_MATCH_CONTRACT = Object.freeze({
  id: null,
  status: null,
  kickoff: null,
  league: null,
  season: null,
  venue: null,
  home: null,
  away: null,
  score: null,
  events: [],
  metadata: {}
});

export function createFootballMatch(data = {}) {
  return {
    id: data.id ?? null,
    status: data.status ?? null,
    kickoff: data.kickoff ?? null,
    league: data.league ?? null,
    season: data.season ?? null,
    venue: data.venue ?? null,
    home: data.home ?? null,
    away: data.away ?? null,
    score: data.score ?? null,
    events: Array.isArray(data.events) ? data.events : [],
    metadata: data.metadata ?? {}
  };
}
