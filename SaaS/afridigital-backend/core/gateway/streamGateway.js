
const express = require('express');
const router = express.Router();

router.post('/connect', (req,res)=>{
  res.json({ ok:true, stream:'connected', mode:'v1' });
});

module.exports = router;
