import { FOOTBALL_COMPETITIONS } from "../../../modules/football/config/FootballCompetitionRegistry.js";

export const footballConfig = {
  leagues: Object.freeze(
    Object.fromEntries(
      Object.values(FOOTBALL_COMPETITIONS)
        .filter(competition => competition.providers?.SportMonks?.leagueId != null)
        .map(competition => [
          competition.key,
          competition.providers.SportMonks.leagueId
        ])
    )
  )
};

export default footballConfig;
