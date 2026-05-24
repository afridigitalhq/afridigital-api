class AgentMesh {
  constructor() {
    this.agents = new Map();
    this.inbox = new Map(); // agent -> messages
  }

  registerAgent(name, handler) {
    this.agents.set(name, handler);
    this.inbox.set(name, []);
  }

  broadcast(from, message) {
    for (const [name] of this.agents.entries()) {
      if (name !== from) {
        this.inbox.get(name).push({
          from,
          message,
          timestamp: Date.now()
        });
      }
    }
  }

  getInbox(agent) {
    return this.inbox.get(agent) || [];
  }

  clearInbox(agent) {
    this.inbox.set(agent, []);
  }

  async runAgent(agentName, context) {
    const handler = this.agents.get(agentName);
    if (!handler) return null;

    const inbox = this.getInbox(agentName);

    const result = await handler({
      context,
      inbox,
      broadcast: (msg) => this.broadcast(agentName, msg)
    });

    this.clearInbox(agentName);
    return result;
  }

  async runCycle(context) {
    const results = [];

    for (const agentName of this.agents.keys()) {
      const res = await this.runAgent(agentName, context);
      if (res) results.push(res);
    }

    return this.synthesize(results);
  }

  synthesize(results) {
    const votes = {};

    for (const r of results) {
      if (!r?.vote) continue;
      votes[r.vote] = (votes[r.vote] || 0) + 1;
    }

    let winner = null;
    let max = 0;

    for (const k in votes) {
      if (votes[k] > max) {
        max = votes[k];
        winner = k;
      }
    }

    return {
      decision: winner,
      raw: results,
      consensus: votes
    };
  }
}

module.exports = { AgentMesh };
