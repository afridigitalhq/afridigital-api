const BaseProvider = require('./baseProvider');

class OpenAIProvider extends BaseProvider {
  constructor() {
    super("openai");
  }

  async generate({ text }) {
    return {
      async *[Symbol.asyncIterator]() {
        yield { type: "token", value: "[openai stub] " + text };
        yield { type: "done" };
      }
    };
  }

  async health() {
    return { status: "stub", latency: 50 };
  }
}

module.exports = new OpenAIProvider();
