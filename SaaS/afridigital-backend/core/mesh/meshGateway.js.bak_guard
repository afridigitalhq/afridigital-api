const express = require("express");
const mesh = require("./meshNode");

const router = express.Router();

router.post("/mesh/event", (req,res)=>{
  const { event, payload } = req.body || {};
  if(event) mesh.receive(event, payload);
  res.json({ ok:true });
});

router.post("/mesh/peer", (req,res)=>{
  const { url } = req.body || {};
  mesh.registerPeer(url);
  res.json({ ok:true });
});

module.exports = router;
