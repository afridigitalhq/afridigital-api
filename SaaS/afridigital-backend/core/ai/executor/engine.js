const stream = require('../stream/bus');

async function execute(streamId, provider, input) {
  stream.push(streamId, { type: "start", provider: provider.name, ts: Date.now() });

  try {
    const res = await provider.generate(input);

    for await (const event of res) {
      stream.push(streamId, {
        ...event,
        provider: provider.name,
        ts: Date.now()
      });
    }

    stream.push(streamId, { type: "done", provider: provider.name, ts: Date.now() });

  } catch (err) {
    stream.push(streamId, {
      type: "error",
      value: err.message,
      provider: provider.name,
      ts: Date.now()
    });

    throw err;
  }
}

module.exports = { execute };
