const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'afridigital-api',
    status: 'healthy'
  });
});

router.get('/ready', (req, res) => {
  res.json({
    ready: true
  });
});

module.exports = router;
