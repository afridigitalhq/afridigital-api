export const FOOTBALL_PROVIDER_CAPABILITIES = Object.freeze([
  "fixtures",
  "fixture",
  "live",
  "events",
  "lineups",
  "standings",
  "scorers",
  "teams",
  "leagues"
]);

export function createFootballProviderContract({
  name,
  capabilities = [],
  getFixtures,
  getFixture,
  getLive,
  getEvents,
  getLineups,
  getStandings,
  getScorers,
  getTeams,
  getLeagues
}) {
  if (!name) throw new Error("Football provider name is required");

  const handlers = {
    getFixtures,
    getFixture,
    getLive,
    getEvents,
    getLineups,
    getStandings,
    getScorers,
    getTeams,
    getLeagues
  };

  return Object.freeze({
    name,
    type: "FOOTBALL_PROVIDER",
    capabilities: Object.freeze(
      capabilities.filter(capability =>
        FOOTBALL_PROVIDER_CAPABILITIES.includes(capability)
      )
    ),
    supports(capability) {
      return this.capabilities.includes(capability);
    },
    async execute(capability, ...args) {
      if (!this.supports(capability)) {
        throw new Error(
          `Football provider "${this.name}" does not support "${capability}"`
        );
      }

      const handler = handlers[`get${capability[0].toUpperCase()}${capability.slice(1)}`];

      if (typeof handler !== "function") {
        throw new Error(
          `Football provider "${this.name}" has no handler for "${capability}"`
        );
      }

      return handler(...args);
    }
  });
}
