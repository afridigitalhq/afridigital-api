const express = require('express');
const runtime = require('./runtime');

const app = express();

/**
 * HEALTH
 */
app.get('/health', (req,res)=>{
  const r = runtime();
  res.json({
    status: "OK",
    state: r.state
  });
});

/**
 * AUDIT
 */
app.get('/audit', (req,res)=>{
  res.json(runtime());
});

/**
 * METRICS
 */
app.get('/metrics', (req,res)=>{
  const r = runtime();
  res.json({
    score: r.score,
    state: r.state
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("🚀 AfriScan SINGLE RUNTIME v1 ACTIVE");
  console.log("✔ One contract system");
  console.log("✔ Renderer excluded from scoring");
  console.log("✔ No version drift");
});
