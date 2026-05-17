const express=require('express');
const validateWebhook=require('./middleware/validateWebhook');
const engine=require('./core/engine');
const sendWhatsApp=require('./core/sender/sendWhatsApp');
const humanThink=require('./core/human/think');

const router=express.Router();

router.get('/health',(req,res)=>res.json({ok:true}));

router.post('/incoming',validateWebhook,async(req,res)=>{
  try{

    const msg=req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const text=msg?.text?.body || '';
    const userId=msg?.from;

    if(!userId) return res.json({ok:false});

    await humanThink();

    const result=await engine(userId,text);

    console.log('🧠 AFRAI OUTBOUND:',{
      to:userId,
      text:result.message,
      intent:result.intent
    });

    await sendWhatsApp(userId,result.message);

    return res.json({ok:true,mode:'live_brain_v2'});

  }catch(e){
    console.error(e);
    return res.status(500).json({error:'afriAI crash'});
  }
});

module.exports=router;
