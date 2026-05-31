const { run } = require("../../kernel");
const delivery = require("./delivery");

async function streamMessage(text, sendFn) {
  const result = await run({
    text,
    apiKey: "whatsapp"
  });

  const words = (result.text || "").split(" ");

  let buffer = "";

  for (const w of words) {
    buffer += w + " ";

    const packet = {
      type: "chunk",
      text: buffer.trim()
    };

    // internal stream log
    await sendFn(packet);

    // 🚀 REAL DELIVERY PIPELINE
    await delivery.send(packet);

    await new Promise(r => setTimeout(r, 120));
  }

  const finalPacket = {
    type: "final",
    text: result.text
  };

  await sendFn(finalPacket);
  await delivery.send(finalPacket);

  return result;
}

module.exports = { streamMessage };
