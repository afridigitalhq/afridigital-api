const express = require("express");
const router = express.Router();

const { runCommand, searchCommands } = require("../../core/command-palette/command.kernel");

router.post("/run", (req, res) => {
  const { command, args } = req.body;

  res.json(runCommand(command, args));
});

router.get("/search", (req, res) => {
  res.json(searchCommands(req.query.q || ""));
});

module.exports = router;
