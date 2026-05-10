const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    kernel: 'v8.12-clean'
  });
});

module.exports = router;
