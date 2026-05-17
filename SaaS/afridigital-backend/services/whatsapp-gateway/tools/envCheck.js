const express=require('express');
const router=express.Router();

router.get('/env-check',(req,res)=>{
  res.json({
    token: process.env.WHATSAPP_TOKEN ? 'SET' : 'MISSING',
    phone: process.env.WHATSAPP_PHONE_ID ? 'SET' : 'MISSING'
  });
});

module.exports=router;
