const { generateReply } = require("./responseEngine");

async function whatsappIntelligence(event, sendWhatsAppMessage){

  try{

    const message = event?.payload || {};

    const reply = generateReply(message);

    // send smart reply
    await sendWhatsAppMessage(message.from, reply);

    return reply;

  }catch(e){

    console.log("⚠️ AfriAI error:", e.message);

    return null;
  }
}

module.exports = { whatsappIntelligence };
