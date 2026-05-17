const express=require("express");
const validateWebhook=require("./middleware/validateWebhook");
const afriAiResponder=require("./core/afriAiResponder");
const streamWhatsAppReply=require("./core/live/streamEngine");
const sendWhatsApp=require("./core/sender/sendWhatsApp");
const engine=require("./core/engine");

const router=express.Router();

router.get("/health",(req,res)=>res.json({ok:true}));

router.post("/incoming",validateWebhook,async(req,res)=>{
  try{

    const msg=req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const text=msg?.text?.body || "";
    const userId=msg?.from;

    if(!userId) return res.json({ok:false});

    const result=await engine(userId,text);

    if(result.type==="tool_call"){
      return res.json({ok:true,mode:"tool",tool:result.tool});
    }

    // 🔥 LIVE OUTBOUND LOGGING
    console.log("🔥 WHATSAPP OUTBOUND:", {
      to: userId,
      text: result.message
    });

    await sendWhatsApp(userId,result.message);

    return res.json({ok:true,mode:"delivered"});

  }catch(e){
    console.error(e);
    return res.status(500).json({error:"afriAI crash"});
  }
});

module.exports=router;
