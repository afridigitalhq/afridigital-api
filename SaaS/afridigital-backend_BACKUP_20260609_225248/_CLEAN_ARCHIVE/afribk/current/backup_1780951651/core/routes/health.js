const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: "afridigital-api",
    status: "locked-v1"
  });
});

module.exports = router;
