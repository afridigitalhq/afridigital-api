const mock = require("../../providers/mockProvider");
const ollama = require("../../providers/ollamaProvider");
const openai = require("../../providers/openaiProvider");

function select(provider) {
  switch (provider) {
    case "ollama": return ollama;
    case "openai": return openai;
    default: return mock;
  }
}

async function adapt(providerName) {
  const p = select(providerName);

  // already compliant stream provider
  if (p.stream) return p;

  // normalize legacy generate() into stream()
  if (p.generate) {
    return {
      stream: async function* (input) {
        const res = await p.generate(input);

        if (res && typeof res[Symbol.asyncIterator] === "function") {
          for await (const chunk of res) {
            yield {
              response: chunk?.response || chunk?.text || chunk?.message || ""
            };
          }
        } else {
          yield { response: String(res || "") };
        }
      }
    };
  }

  throw new Error("Invalid provider interface");
}

module.exports = { adapt, select };
