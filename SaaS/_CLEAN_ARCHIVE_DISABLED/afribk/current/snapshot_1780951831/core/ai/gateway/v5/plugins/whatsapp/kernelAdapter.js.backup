const { run } = require("../../kernel");

async function handleWhatsApp(req, res) {
  try {
    const text = req.body?.text || "";

    const result = await run({
      text,
      source: "whatsapp",
      mode: "kernel"
    });

    // SAFE: single response only (no stream spam)
    return res.json({
      ok: true,
      reply: result?.text || result,
      provider: result?.provider || "kernel"
    });

  } catch (err) {
    console.error("WHATSAPP KERNEL ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}

module.exports = { handleWhatsApp };
