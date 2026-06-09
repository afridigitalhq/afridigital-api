const { adapt } = require("../providerAdapter");

async function execute(providerName, input, push, streamId) {
  const provider = await adapt(providerName);
  const stream = provider.stream(input);

  let final = "";

  for await (const chunk of stream) {
    const token = chunk?.response || "";
    final += token;

    if (push) {
      push(streamId, {
        type: "token",
        value: token,
        ts: Date.now()
      });
    }
  }

  return {
    text: final,
    events: []
  };
}

module.exports = { execute };
