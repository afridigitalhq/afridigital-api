const router = require('express').Router();
const tracker = require('../services/ad.tracker');

router.get('/click/:id', (req, res) => {
  const clickId = req.params.id;
  const userId = req.query.user || "guest";
  const adId = req.query.ad || "unknown";

  tracker.resolveClick(clickId, userId, adId);

  console.log("💰 WALLET UPDATED:", userId);

  return res.redirect("https://www.tiktok.com/@ai_verax?_r=1&_t=ZS-96GZq2w19T5");
});

module.exports = router;
