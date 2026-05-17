const crypto=require('crypto');
const traceId=require('../../utils/traceId');

const TOKEN=process.env.WHATSAPP_TOKEN;
const PHONE_ID=process.env.WHATSAPP_PHONE_ID;

module.exports=async function sendWhatsApp(to,message){

  const id=traceId();

  console.log('🚀 OUTBOUND INIT:',{id,to,message});

  if(!TOKEN||!PHONE_ID){
    console.warn('⚠️ MISSING ENV');
    return {ok:false,id,error:'missing_env'};
  }

  const url=`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;

  const payload={
    messaging_product:'whatsapp',
    to,
    type:'text',
    text:{body:message}
  };

  try{

    const res=await fetch(url,{
      method:'POST',
      headers:{
        'Authorization':`Bearer ${TOKEN}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify(payload)
    });

    const data=await res.json();

    console.log('📡 WHATSAPP RESPONSE:',{id,data});

    return {ok:res.ok,id,data};

  }catch(e){
    console.error('🔥 SEND ERROR:',{id,error:e.message});
    return {ok:false,id,error:e.message};
  }
};
