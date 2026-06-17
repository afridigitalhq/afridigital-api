const bus = require('./v3/bus');
const { waitForDone } = require('./v3/runtime');

const providers = {
  ollama: require('../providers/ollamaProvider'),
  mock: require('../providers/mockProvider'),
  openai: require('../providers/openaiProvider')
};

async function run({ streamId, text, provider = "ollama" }) {
  bus.emit(streamId, { type: "start", ts: Date.now() });

  try {
    const selected = providers[provider] || providers.ollama;
    const res = await selected.generate({ text });

    const iterator =
      res?.[Symbol.asyncIterator]
        ? res
        : res?.body?.[Symbol.asyncIterator]
        ? res.body
        : null;

    if (!iterator) throw new Error("Invalid provider stream");

    for await (const chunk of iterator) {
      const token = chunk?.response || chunk?.text || chunk?.message;

      if (token) {
        bus.emit(streamId, {
          type: "token",
          value: token,
          provider,
          ts: Date.now()
        });
      }
    }

    bus.emit(streamId, {
      type: "done",
      provider,
      ts: Date.now()
    });

  } catch (err) {
    bus.emit(streamId, {
      type: "error",
      value: err.message,
      ts: Date.now()
    });
  }
}

// 🔥 NEW: FULL SAAS FUNCTION
async function runAndWait(params) {
  await run(params);
  return waitForDone(params.streamId);
}

module.exports = { run, runAndWait };
