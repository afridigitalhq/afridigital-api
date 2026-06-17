const express = require("express");

const app = express();
app.use(express.json());

// HEALTH
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "afri-ai-clean" });
});

// WHATSAPP BASELINE (NO ENGINE YET)


  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 CLEAN SERVER RUNNING ON", PORT);
});


const a2Engine = require('./core/ai/gateway/v5/plugins/whatsapp/a2Engine');

app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const text = req.body?.text || '';

    const result = await a2Engine.enqueue({ text });

    return res.json({
      ok: true,
      engine: 'A2',
      queued: true,
      id: result.id
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});
