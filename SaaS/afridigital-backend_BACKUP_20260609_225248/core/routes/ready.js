const router = require('express').Router();

router.get('/ready', (req, res) => {
  res.json({
    ready: true,
    service: "afridigital-api",
    status: "kernel-v2"
  });
});

module.exports = router;
