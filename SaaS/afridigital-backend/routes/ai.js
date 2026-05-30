
const express = require('express');
const router = express.Router();

router.post('/ai/reply', async (req,res)=>{
  return res.json({
    ok:true,
    message:"AI route alive",
    input:req.body
  });
});

module.exports = router;
