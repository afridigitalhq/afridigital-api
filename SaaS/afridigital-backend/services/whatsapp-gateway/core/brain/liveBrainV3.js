const traceId=require('../../utils/traceId');

async function processMessage(msg){
  const id=traceId();

  console.log('🧠 BRAIN v3 START:',{id,msg});

  const text=msg?.text?.body || '';

  // SIMPLE deterministic reply engine (expand later)
  let reply='I received: '+text;

  console.log('🧠 BRAIN v3 OUTPUT:',{id,reply});

  return {id,reply};
}

module.exports={processMessage};
