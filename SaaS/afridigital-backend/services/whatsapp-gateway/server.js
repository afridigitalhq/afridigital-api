console.log('🧠 BRAIN EXPORT:',require('./core/brain'));
const brain=require('./core/brain/liveBrainV5');
const delivery=require('./core/delivery/deliveryEngine');

module.exports=async (req,res)=>{

  try{

    const msg=req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    console.log('📩 INCOMING WEBHOOK HIT:',JSON.stringify(msg));

    if(!msg){
      return res.json({ok:false,error:'no_message'});
    }

    const to=msg.from;

    const {reply}=await require('./core/brain/index').processMessage(msg);

    await delivery.deliver(to,reply);

    return res.json({ok:true,delivered:true});

  }catch(e){
    console.error('🔥 DELIVERY BRAIN ERROR:',e);
    return res.status(500).json({ok:false,error:e.message});
  }
};
