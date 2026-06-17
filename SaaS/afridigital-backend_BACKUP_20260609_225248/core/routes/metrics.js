const router = require('express').Router();

router.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

module.exports = router;
