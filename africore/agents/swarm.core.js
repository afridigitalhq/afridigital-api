const bus = require("../runtime/event.bus");

class SwarmCore {
  constructor() {
    this.agents = [];
  }

  register(agent) {
    this.agents.push(agent);
  }

  start() {
    bus.subscribe("incoming.message", async (msg) => {
      for (const agent of this.agents) {
        try {
          await agent.run(msg, bus);
        } catch (e) {
          console.log("AGENT ERROR:", e.message);
        }
      }
    });
  }
}

module.exports = new SwarmCore();
