const Base = require('./base');

class OpenAIProvider extends Base {
  constructor() {
    super("openai");
  }

  async generate() {
    throw new Error("OpenAI not wired yet");
  }
}

module.exports = new OpenAIProvider();
