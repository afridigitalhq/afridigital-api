export const FOOTBALL_COMPETITIONS = Object.freeze({
  premierLeague: Object.freeze({
    key: "premierLeague",
    name: "Premier League",
    country: "England",
    providers: Object.freeze({
      "API-Football": Object.freeze({ leagueId: 39 }),
      SportMonks: Object.freeze({ leagueId: 8, seasonId: null })
    })
  }),
  championsLeague: Object.freeze({
    key: "championsLeague",
    name: "Champions League",
    country: "Europe",
    providers: Object.freeze({
      "API-Football": Object.freeze({ leagueId: 2 }),
      SportMonks: Object.freeze({ leagueId: 2, seasonId: null })
    })
  }),
  laLiga: Object.freeze({
    key: "laLiga",
    name: "La Liga",
    country: "Spain",
    providers: Object.freeze({
      "API-Football": Object.freeze({ leagueId: 140 }),
      SportMonks: Object.freeze({ leagueId: null, seasonId: null })
    })
  }),
  serieA: Object.freeze({
    key: "serieA",
    name: "Serie A",
    country: "Italy",
    providers: Object.freeze({
      "API-Football": Object.freeze({ leagueId: 135 }),
      SportMonks: Object.freeze({ leagueId: null, seasonId: null })
    })
  }),
  bundesliga: Object.freeze({
    key: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    providers: Object.freeze({
      "API-Football": Object.freeze({ leagueId: 78 }),
      SportMonks: Object.freeze({ leagueId: null, seasonId: null })
    })
  }),
  ligue1: Object.freeze({
    key: "ligue1",
    name: "Ligue 1",
    country: "France",
    providers: Object.freeze({
      "API-Football": Object.freeze({ leagueId: 61 }),
      SportMonks: Object.freeze({ leagueId: null, seasonId: null })
    })
  }),
  superliga: Object.freeze({
    key: "superliga",
    name: "Superliga",
    country: "Denmark",
    providers: Object.freeze({
      SportMonks: Object.freeze({ leagueId: 271, seasonId: 27897 })
    })
  }),
  premiership: Object.freeze({
    key: "premiership",
    name: "Premiership",
    country: "Scotland",
    providers: Object.freeze({
      SportMonks: Object.freeze({ leagueId: 501, seasonId: 28275 })
    })
  }),
  premiershipPlayoffs: Object.freeze({
    key: "premiershipPlayoffs",
    name: "Premiership Play-Offs",
    country: "Scotland",
    active: false,
    providers: Object.freeze({
      SportMonks: Object.freeze({ leagueId: 513, seasonId: 27934 })
    })
  }),
  superligaPlayoffs: Object.freeze({
    key: "superligaPlayoffs",
    name: "Superliga Play-offs",
    country: "Denmark",
    active: false,
    providers: Object.freeze({
      SportMonks: Object.freeze({ leagueId: 1659, seasonId: null })
    })
  })
});

export function getFootballCompetition(key) {
  return FOOTBALL_COMPETITIONS[key] || null;
}

export function resolveFootballCompetition(key, provider) {
  const competition = getFootballCompetition(key);
  if (!competition) return null;
  const mapping = competition.providers?.[provider];
  if (!mapping) {
    throw new Error(`Football competition "${key}" is not configured for provider "${provider}"`);
  }
  if (mapping.leagueId == null) {
    throw new Error(`Football competition "${key}" has no league mapping for provider "${provider}"`);
  }
  return Object.freeze({
    ...competition,
    provider,
    leagueId: mapping.leagueId ?? null,
    seasonId: mapping.seasonId ?? null
  });
}

export function getActiveFootballCompetitions() {
  return Object.values(FOOTBALL_COMPETITIONS).filter(
    competition => competition.active !== false
  );
}

export default FOOTBALL_COMPETITIONS;
