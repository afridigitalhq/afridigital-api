const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({ message: "💳 Paystack route active" });
});

module.exports = router;
