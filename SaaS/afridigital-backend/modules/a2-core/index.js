const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: "a2-core online" });
});

module.exports = router;
