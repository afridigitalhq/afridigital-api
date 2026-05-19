const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: "chat module stable (sandbox mode)",
    note: "AI engine temporarily isolated for stabilization"
  });
});

module.exports = router;
