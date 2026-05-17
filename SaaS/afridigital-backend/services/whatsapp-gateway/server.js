const debugEnv=require('./tools/debugEnv');
const debugEnv=require('./tools/debugEnv');
const express=require('express');
const validateWebhook=require('./middleware/validateWebhook');
const engine=require('./core/engine');
const sendWhatsApp=require('./core/sender/sendWhatsApp');
const testRoute=require('./tools/testRoute');

const router=express.Router();

router.get('/health',(req,res)=>res.json({ok:true}));

router.use('/tools',testRoute);

router.post('/incoming',validateWebhook,async(req,res)=>{
  try{
    const msg=req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const text=msg?.text?.body || '';
    const userId=msg?.from;

    if(!userId) return res.json({ok:false});

    const result=await engine(userId,text);

    console.log('🔥 WHATSAPP OUTBOUND:',{
      to:userId,
      text:result.message
    });

    await sendWhatsApp(userId,result.message);

    return res.json({ok:true,mode:'delivered'});

  }catch(e){
    console.error(e);
    return res.status(500).json({error:'afriAI crash'});
  }
});

router.use('/tools',debugEnv);

module.exports=router;
