const { execute } = require("./runtime/execute");
const bus = require("../../stream/streamBus");

async function runRequest({ streamId, text, provider = "mock" }) {

  bus.push(streamId, {
    type: "start",
    ts: Date.now()
  });

  const result = await execute(
    provider,
    { text },
    bus.push,
    streamId
  );

  bus.push(streamId, {
    type: "done",
    ts: Date.now()
  });

  return result;
}

module.exports = { runRequest };
