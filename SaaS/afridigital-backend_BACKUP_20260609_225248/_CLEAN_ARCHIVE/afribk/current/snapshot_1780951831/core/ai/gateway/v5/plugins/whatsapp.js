const { run } = require("../kernel");

async function handleMessage(msg) {
  const result = await run({
    apiKey: "whatsapp",
    text: msg.text
  });

  return result.text;
}

module.exports = { handleMessage };
