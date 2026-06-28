// AFRIKERNEL_MODULE_ONLY_RUNTIME (NO app.listen ALLOWED)
const express = require('express');
const fs = require('fs');

const app = express();

app.get('/afrid/state', (req, res) => {
  const raw = fs.readFileSync('./core/.afrid_state', 'utf-8');

  const state = Object.fromEntries(
    raw.split('\n').filter(Boolean).map(line => line.split('='))
  );

  res.json(state);
});

app.get('/go/:service',(req,res)=>{const map={hfm:'https://hfm.com/?refid=YOUR_ID'};const s=req.params.service;if(map[s]){console.log('OUTBOUND',s,req.ip,Date.now());res.redirect(map[s])}else{res.status(404).send('Unknown service')}});
// DISABLED_LISTEN(app.listen(3000, () => {
  console.log('⚡ Afri state running on http://localhost:3000/afrid/state');
});
