const providers = {
  mock: async (input) => ({ text: "[MOCK]" + input.replace(/\s/g, "") }),
  ollama: async (input) => ({ text: "[OLLAMA]" + input }),
  openai: async (input) => ({ text: "[OPENAI]" + input })
};

function selectProvider() {
  // SAFE DEFAULT: mock-first for Render stability
  return "mock";
}

async function runWithFallback(input) {
  const order = ["mock", "ollama", "openai"];

  for (const key of order) {
    try {
      const res = await providers[key](input);
      return { provider: key, result: res };
    } catch (e) {
      continue;
    }
  }

  return { provider: "none", result: { text: "[FALLBACK FAILED]" } };
}

module.exports = { selectProvider, runWithFallback };
