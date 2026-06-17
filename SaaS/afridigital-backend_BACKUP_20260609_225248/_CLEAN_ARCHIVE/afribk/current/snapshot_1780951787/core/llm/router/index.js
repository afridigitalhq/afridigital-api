const providers = {
  ollama: require('../providers/ollama'),
  openai: require('../providers/openai'),
  fallback: require('../providers/fallback')
};

async function stream({ model = "ollama", prompt, streamId, onToken }) {
  const provider = providers[model] || providers.ollama;

  try {
    return await provider.stream({ prompt, streamId, onToken });
  } catch (e) {
    console.log("⚠️ provider failed, falling back:", e.message);
    return providers.fallback.stream({ prompt, streamId, onToken });
  }
}

module.exports = { stream };
