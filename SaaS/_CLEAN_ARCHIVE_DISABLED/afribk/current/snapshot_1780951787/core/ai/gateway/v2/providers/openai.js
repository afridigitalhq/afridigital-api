class OpenAIProvider {
  async *generate({ text }) {
    yield { response: "[OPENAI_DISABLED]" };
  }
}
module.exports = new OpenAIProvider();
