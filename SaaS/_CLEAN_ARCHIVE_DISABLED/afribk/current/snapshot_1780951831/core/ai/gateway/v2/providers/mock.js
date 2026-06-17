class MockProvider {
  async *generate({ text }) {
    const words = ("[MOCK] " + text).split(" ");
    for (const w of words) {
      yield { response: w };
    }
  }
}
module.exports = new MockProvider();
