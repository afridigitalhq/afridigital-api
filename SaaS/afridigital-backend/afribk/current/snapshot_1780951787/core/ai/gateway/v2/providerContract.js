/**
 * ALL providers MUST implement this:
 *
 * async generate({ text, model }) => AsyncIterable<{ response }>
 */

class ProviderContract {
  async generate() {
    throw new Error("Provider must implement generate()");
  }
}

module.exports = ProviderContract;
