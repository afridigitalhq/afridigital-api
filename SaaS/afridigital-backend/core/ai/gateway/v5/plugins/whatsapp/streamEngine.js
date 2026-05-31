const { run } = require("../../kernel");

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function streamWhatsApp(text) {
  const chunks = text.split(" ");

  let output = "";

  for (const word of chunks) {
    await delay(250);
    output += (output ? " " : "") + word;

    console.log("WHATSAPP STREAM:", {
      type: "chunk",
      text: output
    });
  }

  return output;
}

async function handleStreamingWhatsApp(req, res) {
  try {
    const text = req.body?.text || "";

    // 1. typing simulation start
    console.log("WHATSAPP STREAM: typing...");

    // 2. kernel execution (single source of truth)
    const result = await run({ text, source: "whatsapp" });

    const finalText = result?.text || result;

    // 3. streaming simulation (UX layer only)
    const streamed = await streamWhatsApp(finalText);

    // 4. final commit
    return res.json({
      ok: true,
      reply: streamed,
      provider: result?.provider || "kernel",
      streamed: true
    });

  } catch (err) {
    console.error("WHATSAPP STREAM ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}

module.exports = { handleStreamingWhatsApp };
