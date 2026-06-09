const streamBus = require('../stream/streamBus');
const { selectProvider } = require('./router');

async function run({ streamId, text, provider = "mock" }) {
  const selected = selectProvider(provider);

  streamBus.push(streamId, {
    type: "start",
    provider,
    ts: Date.now()
  });

  try {
    await selected.stream({
      text,
      onToken: (token) => {
        streamBus.push(streamId, {
          type: "token",
          value: token,
          provider,
          ts: Date.now()
        });
      },
      onDone: () => {
        streamBus.push(streamId, {
          type: "done",
          provider,
          ts: Date.now()
        });
      },
      onError: (err) => {
        streamBus.push(streamId, {
          type: "error",
          value: err.message,
          provider,
          ts: Date.now()
        });
      }
    });
  } catch (err) {
    streamBus.push(streamId, {
      type: "error",
      value: err.message,
      provider,
      ts: Date.now()
    });
  }
}

module.exports = { run };
