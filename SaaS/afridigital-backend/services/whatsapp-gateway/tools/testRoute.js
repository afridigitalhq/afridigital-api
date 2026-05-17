const express=require('express');
const router=express.Router();

// SAFE TEST ENDPOINT (NO WhatsApp API CALL)
router.post('/test-send',async(req,res)=>{
  const to=req.body?.to || 'test';
  const message=req.body?.message || 'AfriAI test message';

  console.log('🧪 TEST WHATSAPP PIPELINE:',{to,message});

  return res.json({
    ok:true,
    mode:'test',
    to,
    message,
    status:'pipeline_ok'
  });
});

module.exports=router;
