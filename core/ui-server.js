const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

/* UI */
app.use("/", express.static(path.join(__dirname, "../SaaS/afridigital-frontend")));
app.use("/modules", express.static(path.join(__dirname, "../SaaS/afridigital-frontend/src/partials")));
app.use("/partials", express.static(path.join(__dirname, "../SaaS/afridigital-frontend/partials")));

/* STATE */
app.get("/afrid/state", (req, res) => {
  const statePath = path.join(__dirname, ".afrid_state");

  try {
    const raw = fs.readFileSync(statePath, "utf-8");

    const state = Object.fromEntries(
      raw.split("\n")
        .filter(Boolean)
        .map(line => line.split("="))
    );

    res.json(state);
  } catch (e) {
    res.json({
      mode: "DEVOPS",
      lock: "0",
      deploy: "https://afridigital-hub.onrender.com"
    });
  }
});

/* HEALTH */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* START */
app.get('/go/:service',(req,res)=>{const map={hfm:'https://hfm.com/?refid=YOUR_ID'};const s=req.params.service;if(map[s]){console.log('OUTBOUND',s,req.ip,Date.now());res.redirect(map[s])}else{res.status(404).send('Unknown service')}});
app.listen(PORT, () => {
  console.log(`⚡ AFRIDIGITAL HUB LIVE → http://localhost:${PORT}`);
});
