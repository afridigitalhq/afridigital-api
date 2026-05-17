const sendWhatsApp=require('../../../core/sender/sendWhatsApp');
const traceId=require('../../utils/traceId');

const sessions=new Map();

function safeMsg(body){
  return body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0] || null;
}

module.exports=async(req,res)=>{
  const id=traceId();

  try{
    const msg=safeMsg(req.body);

    if(!msg){
      console.log('⚠️ V5 NO MESSAGE',{id});
      return res.json({ok:false,id,error:'no_message'});
    }

    const from=msg.from;
    const text=msg?.text?.body||'';

    const prev=sessions.get(from)||{count:0};

    const session={
      count:prev.count+1,
      last:text,
      ts:Date.now()
    };

    sessions.set(from,session);

    console.log('🧠 V5 IN:',{id,from,session});

    let reply;

    const t=text.toLowerCase();

    if(t.includes('hello')){
      reply='👋 AfriAI V5 online. Session '+session.count;
    }else if(t.includes('status')){
      reply='📡 V5 ACTIVE | sessions:'+session.count;
    }else if(t.includes('error')){
      reply='⚠️ Diagnostic mode active';
    }else{
      reply='AfriAI V5: '+text;
    }

    const result=await sendWhatsApp(from,reply);
    console.log("📡 RAW WHATSAPP RESPONSE:",result);

    const delivered=!!result?.ok;

    console.log('📤 V5 OUT:',{id,delivered,result});

    return res.json({
      ok:true,
      id,
      mode:'delivery_brain_v5',
      delivered,
      session
    });

  }catch(e){
    console.error('🔥 V5 CRASH',{id,error:e.message});
    return res.status(500).json({ok:false,id,error:e.message});
  }
};
