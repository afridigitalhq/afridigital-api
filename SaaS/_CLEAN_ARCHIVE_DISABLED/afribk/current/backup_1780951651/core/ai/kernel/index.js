const registry = require("../registry/providerRegistry");
const streamBus = require("../stream/streamBus");

async function run({ streamId, text, provider = "ollama" }) {
  const prov = registry.get(provider);

  streamBus.emit(streamId, { type: "start" });

  let result = "";

  try {
    await prov.generate({
      prompt: text,
      stream: true,
      onToken: (token) => {
        result += token;

        streamBus.emit(streamId, {
          type: "token",
          value: token
        });
      }
    });

    streamBus.emit(streamId, { type: "done" });

    return {
      ok: true,
      streamId,
      result
    };

  } catch (err) {
    streamBus.emit(streamId, {
      type: "error",
      value: err.message
    });

    return {
      ok: false,
      error: err.message
    };
  }
}

module.exports = { run };
