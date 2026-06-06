const express = require("express");
const router = express.Router();

const {
  getAdminConsoleSnapshot
} = require("../core/admin/console");

router.get("/admin/console", (req, res) => {
  res.json(getAdminConsoleSnapshot());
});

module.exports = router;
