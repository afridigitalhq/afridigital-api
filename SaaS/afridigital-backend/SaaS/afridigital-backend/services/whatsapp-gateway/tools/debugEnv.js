const express=require('express');
const router=express.Router();

router.get('/debug-env',(req,res)=>{
  res.json({
    token: !!process.env.WHATSAPP_TOKEN,
    phone: !!process.env.WHATSAPP_PHONE_ID
  });
});

module.exports=router;
