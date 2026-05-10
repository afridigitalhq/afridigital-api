const express = require('express');
const router = express.Router();

const { handleIncoming } =
require('../runtime/runtime.engine');

router.post('/webhook/whatsapp',
async (req, res) => {

  try {

    await handleIncoming(req.body);

    res.status(200).json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'runtime_failure'
    });
  }
});

module.exports = router;
