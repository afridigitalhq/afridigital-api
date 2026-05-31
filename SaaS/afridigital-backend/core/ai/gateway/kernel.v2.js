const stream = require('../stream/streamBus');

const { selectProvider } = require('./v2/router');
const health = require('./v2/health');
const circuit = require('./v2/circuit');

const providers = {
  ollama: require('../providers/ollamaProvider'),
  mock: require('../providers/mockProvider'),
  openai: require('../providers/openaiProvider')
};

async function run({ streamId, text, auto = true, provider }) {
  const start = Date.now();

  stream.push(streamId, { type: "start", ts: start });

  const selectedName = auto
    ? selectProvider(Object.keys(providers))
    : provider || "mock";

  const selected = providers[selectedName] || providers.mock;

  try {
    const res = await selected.generate({ text });

    // 🔥 FIX: normalize iterator correctly
    const iterator =
      typeof res?.[Symbol.asyncIterator] === "function"
        ? res
        : res?.stream
        ? res.stream
        : res?.body?.[Symbol.asyncIterator]
        ? res.body
        : null;

    if (!iterator) {
      throw new Error("Invalid provider stream shape");
    }

    for await (const chunk of iterator) {
      const token = chunk?.response || chunk?.text || chunk?.message;

      if (token) {
        stream.push(streamId, {
          type: "token",
          value: token,
          provider: selectedName,
          ts: Date.now()
        });
      }
    }

    const latency = Date.now() - start;

    health.record(selectedName, true, latency);
    circuit.success(selectedName);

    stream.push(streamId, {
      type: "done",
      provider: selectedName,
      latency,
      ts: Date.now()
    });

  } catch (err) {
    const latency = Date.now() - start;

    health.record(selectedName, false, latency);
    circuit.fail(selectedName);

    stream.push(streamId, {
      type: "error",
      value: err.message,
      provider: selectedName,
      ts: Date.now()
    });
  }
}

module.exports = { run };
