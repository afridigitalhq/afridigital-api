const express=require('express');
const validateWebhook=require('./middleware/validateWebhook');
const afriAiResponder=require('./core/afriAiResponder');
const streamWhatsAppReply=require('./core/live/streamEngine');

const router=express.Router();

router.get('/health',(req,res)=>res.json({ok:true}));

router.post('/incoming',validateWebhook,async(req,res)=>{
  try{
    const msg=req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const text=msg?.text?.body || '';
    const userId=msg?.from;

    const decision=await afriAiResponder(userId,text);

    if(decision.type==='tool_call'){
      return res.json({ok:true,mode:'tool'});
    }

    await streamWhatsAppReply(userId, decision.message || '...');

    return res.json({ok:true,mode:'sent'});

  }catch(e){
    console.error(e);
    return res.status(500).json({error:'afriAI crash'});
  }
});

module.exports=router;
