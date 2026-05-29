const { StreamCore } = require("../streamCore");

/**
 * SIMPLE AGENT DEFINITIONS (lightweight, no duplication)
 */
const agents = {
  planner: async (input) => {
    return `PLAN: ${input}`;
  },

  executor: async (input) => {
    return `EXECUTE: ${input}`;
  },

  narrator: async (input) => {
    return `RESPONSE: ${input}`;
  }
};

/**
 * MULTI-AGENT STREAM COORDINATOR
 * - runs agents in sequence
 * - merges output into single stream
 */
class StreamCoordinator {
  constructor(streamCore) {
    this.stream = streamCore;
  }

  async run({ id, text }) {
    let context = text;

    // 1. Planner
    const plan = await agents.planner(context);

    // 2. Executor
    const execution = await agents.executor(plan);

    // 3. Narrator (final human output)
    const final = await agents.narrator(execution);

    // STREAM FINAL OUTPUT ONLY (keeps WhatsApp clean)
    await this.stream.streamText({
      id,
      text: final,
      delay: 60
    });
  }
}

module.exports = {
  StreamCoordinator
};
