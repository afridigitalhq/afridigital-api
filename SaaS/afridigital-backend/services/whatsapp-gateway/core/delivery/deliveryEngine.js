const sendWhatsApp=require('../sender/sendWhatsApp');

async function deliver(to,reply){
console.log("📲 DELIVERY FUNCTION CALLED:", to, reply);
console.log("📲 WHATSAPP API CALL EXECUTING");
  console.log('📦 DELIVERY INIT:',{to,reply});

  const result=await sendWhatsApp(to,reply);

  console.log('📡 DELIVERY RESULT:',result);

  return result;
}

module.exports={deliver};
