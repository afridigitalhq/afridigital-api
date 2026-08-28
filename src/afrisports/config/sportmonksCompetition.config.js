export const SPORTMONKS_COMPETITIONS = Object.freeze({
  superliga: Object.freeze({
    key: "superliga",
    name: "Superliga",
    leagueId: 271,
    currentSeasonId: 27897,
    country: "Denmark",
    active: true
  }),
  premiership: Object.freeze({
    key: "premiership",
    name: "Premiership",
    leagueId: 501,
    currentSeasonId: 28275,
    country: "Scotland",
    active: true
  }),
  premiershipPlayoffs: Object.freeze({
    key: "premiershipPlayoffs",
    name: "Premiership Play-Offs",
    leagueId: 513,
    currentSeasonId: 27934,
    country: "Scotland",
    active: false
  }),
  superligaPlayoffs: Object.freeze({
    key: "superligaPlayoffs",
    name: "Superliga Play-offs",
    leagueId: 1659,
    currentSeasonId: null,
    country: "Denmark",
    active: false
  })
});

export function getSportMonksCompetition(key) {
  return SPORTMONKS_COMPETITIONS[key] || null;
}

export function getActiveSportMonksCompetitions() {
  return Object.values(SPORTMONKS_COMPETITIONS).filter(
    competition => competition.active
  );
}

export default SPORTMONKS_COMPETITIONS;
