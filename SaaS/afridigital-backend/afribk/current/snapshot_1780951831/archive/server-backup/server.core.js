const express = require("express");

const app = express();
app.use(express.json());

// HEALTH
app.get("/health", (req, res) => {

// WHATSAPP BASELINE (NO ENGINE YET)


    return res.status(500).json({
      ok: false,
      error: err.message

const PORT = process.env.PORT || 3000;