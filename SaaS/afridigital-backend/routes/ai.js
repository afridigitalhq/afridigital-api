const express = require('express');
const router = express.Router();
const kernel = require('../core/africore/runtime/kernel');
const streamWorker = require('../core/workers/streamWorker');

router.post('/ai', async (req, res) => {
  try {
    const streamId = Date.now().toString();

    const payload = {
      user: req.body.user,
      text: req.body.text,
      streamId
    };

    streamWorker.push(streamId, { type: 'start' });

    const result = await undefined;

    streamWorker.push(streamId, { type: 'token', value: result });

    streamWorker.push(streamId, { type: 'done' });

    return res.json({ ok: true, status: 'streaming', streamId });

  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
