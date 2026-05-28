const router = require('express').Router();
const africore = require('../core/africore');

router.post('/ai/reply', async (req,res)=>{
  try{
    const result = await africore.handleEvent({
      type: "message.received",
      user: req.body.user,
      text: req.body.text
    });

    res.json({ ok:true, result });
  }catch(e){
    res.status(500).json({ ok:false, error:e.message });
  }
});

module.exports = router;
