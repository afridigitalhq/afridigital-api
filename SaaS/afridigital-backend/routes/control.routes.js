const router = require('express').Router();
const metrics = require('../core/observability/metrics');
const bus = require('../core/bus/event.bus');

router.get('/metrics', (req, res) => {
  res.json(metrics.get());
});

router.get('/queue', (req, res) => {
  res.json(bus.consume());
});

module.exports = router;
