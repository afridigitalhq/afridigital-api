const express = require('express');
const router = express.Router();

const { getStream } = require('../core/stream/pollStreamStore');

router.get('/ai/stream', (req, res) => {
  const { streamId } = req.query;

  if (!streamId) {
    return res.status(400).json({
      ok: false,
      error: 'streamId required'
    });
  }

  const events = getStream(streamId);

  res.json({
    ok: true,
    streamId,
    events
  });
});

module.exports = router;
