const express=require('express');
const sendWhatsApp=require('../core/sender/sendWhatsApp');
const traceId=require('../utils/traceId');

module.exports=async(req,res)=>{
  const id=traceId();
  try{
    const body=req.body;

    console.log('📩 INCOMING V3:',{id,body});

    const message=body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if(!message){
      console.log('⚠️ NO MESSAGE FOUND',{id});
      return res.json({ok:false,id,error:'no_message'});
    }

    const from=message.from;
    const text=message?.text?.body||'';

    console.log('🧠 PARSED MESSAGE',{id,from,text});

    const reply='AfriAI received: '+text;

    const result=await sendWhatsApp(from,reply);

    console.log('📤 DELIVERY RESULT',{id,result});

    return res.json({
      ok:true,
      id,
      mode:'live_brain_v3',
      delivered:result.ok
    });

  }catch(e){
    console.error('🔥 BRAIN FAILURE',{id,error:e.message});
    return res.status(500).json({ok:false,id,error:e.message});
  }
};
