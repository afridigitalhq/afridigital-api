const { AgentMesh } = require("./agent.mesh.v4.cjs");
const { AgentEconomy } = require("./agent.economy.v5.cjs");

class EconomicMesh extends AgentMesh {
  constructor(redis) {
    super();
    this.economy = new AgentEconomy(redis);
  }

  async synthesize(results) {
    const weighted = {};

    for (const r of results) {
      if (!r?.vote || !r?.agent) continue;

      const w = await this.economy.weight(r.agent);
      weighted[r.vote] = (weighted[r.vote] || 0) + w;
    }

    let winner = null;
    let max = 0;

    for (const k in weighted) {
      if (weighted[k] > max) {
        max = weighted[k];
        winner = k;
      }
    }

    return {
      decision: winner,
      weightedVotes: weighted,
      raw: results
    };
  }
}

module.exports = { EconomicMesh };
