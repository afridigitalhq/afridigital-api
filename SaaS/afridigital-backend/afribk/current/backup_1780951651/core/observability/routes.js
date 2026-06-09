const express = require('express');
const router = express.Router();

const { snapshot } = require('./metrics');
const trace = require('./trace');

router.get('/metrics', (req, res) => {
  res.json(snapshot());
});

router.get('/trace/:id', trace);

router.get('/ready', (req, res) => {
  res.json({ ok: true, status: 'ready' });
});

module.exports = router;
