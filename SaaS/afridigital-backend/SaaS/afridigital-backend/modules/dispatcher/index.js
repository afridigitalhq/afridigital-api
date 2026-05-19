const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: "dispatcher stable (sandbox mode)",
    note: "AI routing temporarily disabled"
  });
});

module.exports = router;
