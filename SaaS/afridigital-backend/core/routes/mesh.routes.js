const express = require("express");
const router = express.Router();
const mesh = require("../mesh/meshNode");

/**
 * Receive remote events from other nodes
 */
router.post("/mesh/ingest", (req, res) => {
  const event = req.body;

  if (!event || !event.type) {
    return res.status(400).json({ error: "invalid event" });
  }

  mesh.ingest(event);

  res.json({ ok: true });
});

/**
 * Register peer node
 */
router.post("/mesh/peer", (req, res) => {
  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: "missing url" });
  }

  mesh.registerPeer(url);

  res.json({
    ok: true,
    peers: Array.from(mesh.peers)
  });
});

module.exports = router;
