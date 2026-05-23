class AgentEconomy {
  constructor(redis) {
    this.redis = redis;
  }

  key(agent) {
    return `agent:economy:${agent}`;
  }

  async get(agent) {
    const data = await this.redis.get(this.key(agent));
    return data ? JSON.parse(data) : {
      credits: 100,
      reputation: 0.5,
      decisions: 0,
      success: 0
    };
  }

  async reward(agent, value = 10) {
    const profile = await this.get(agent);

    profile.credits += value;
    profile.success += 1;
    profile.decisions += 1;
    profile.reputation = profile.success / profile.decisions;

    await this.redis.set(this.key(agent), JSON.stringify(profile));
    return profile;
  }

  async penalize(agent, value = 5) {
    const profile = await this.get(agent);

    profile.credits -= value;
    profile.decisions += 1;
    profile.reputation = profile.success / profile.decisions;

    await this.redis.set(this.key(agent), JSON.stringify(profile));
    return profile;
  }

  async weight(agent) {
    const profile = await this.get(agent);

    // bounded influence weight
    return Math.min(Math.max(profile.reputation, 0.1), 1);
  }
}

module.exports = { AgentEconomy };
