const express = require("express");
const router = express.Router();
const { handleAsk } = require("../core/afriai/afriai.bridge");

/**
 * AfriAI HTTP interaction layer
 * READ ONLY
 */

router.post("/ask", express.json(), (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const result = handleAsk({ sessionId, message });
    res.json({ ok: true, data: result });
  } catch (e) {
    res.status(500).json({ ok: false, error: "AFRIAI_FAILED" });
  }
});

router.get("/session/:id", (req, res) => {
  res.json({ ok: true, sessionId: req.params.id });
});

module.exports = router;
