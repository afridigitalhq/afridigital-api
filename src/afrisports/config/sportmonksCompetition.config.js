import {
  FOOTBALL_COMPETITIONS,
  getFootballCompetition,
  getActiveFootballCompetitions
} from "../../../modules/football/config/FootballCompetitionRegistry.js";

export const SPORTMONKS_COMPETITIONS = Object.freeze(
  Object.fromEntries(
    Object.values(FOOTBALL_COMPETITIONS)
      .filter(competition => competition.providers?.SportMonks)
      .map(competition => {
        const mapping = competition.providers.SportMonks;
        return [
          competition.key,
          Object.freeze({
            key: competition.key,
            name: competition.name,
            leagueId: mapping.leagueId,
            currentSeasonId: mapping.seasonId,
            country: competition.country,
            active: competition.active !== false
          })
        ];
      })
  )
);

export function getSportMonksCompetition(key) {
  return getFootballCompetition(key)?.providers?.SportMonks
    ? SPORTMONKS_COMPETITIONS[key] || null
    : null;
}

export function getActiveSportMonksCompetitions() {
  return getActiveFootballCompetitions()
    .filter(competition => competition.providers?.SportMonks)
    .map(competition => SPORTMONKS_COMPETITIONS[competition.key]);
}

export default SPORTMONKS_COMPETITIONS;
