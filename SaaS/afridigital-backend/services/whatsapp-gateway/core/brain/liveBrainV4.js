const sendWhatsApp=require('../core/sender/sendWhatsApp');
const traceId=require('../utils/traceId');

const memory=new Map();

module.exports=async(req,res)=>{
  const id=traceId();

  try{
    const body=req.body||{};

    const msg=body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if(!msg){
      return res.json({ok:false,id,error:'no_message'});
    }

    const from=msg.from;
    const text=msg?.text?.body||'';

    const prev=memory.get(from)||{};

    const session={
      lastMessage:text,
      lastSeen:Date.now()
    };

    memory.set(from,session);

    console.log('🧠 V4 SESSION:',{id,from,session,prev});

    let reply;

    if(text.toLowerCase().includes('hello')){
      reply='👋 Hello! AfriAI V4 is active.';
    }else if(text.toLowerCase().includes('help')){
      reply='🛠 I can help you with messages, automation, and AI replies.';
    }else{
      reply='AfriAI V4: '+text;
    }

    const result=await sendWhatsApp(from,reply);

    console.log('📤 V4 DELIVERY:',{id,result});

    return res.json({
      ok:true,
      id,
      mode:'delivery_brain_v4',
      delivered:result.ok
    });

  }catch(e){
    console.error('🔥 V4 FAILURE',{id,error:e.message});
    return res.status(500).json({ok:false,id,error:e.message});
  }
};
