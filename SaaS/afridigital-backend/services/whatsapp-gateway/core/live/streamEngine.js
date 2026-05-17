const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
const sendWhatsApp = require('../sender/sendWhatsApp');

module.exports = async function streamWhatsAppReply(to, text){

  const safe = (text || '').toString();
  const chunks = safe.match(/.{1,60}/g) || [safe];

  let buffer = '';

  for(const chunk of chunks){
    await sleep(400 + Math.random()*600);
    buffer += chunk;

    // optional: simulate typing by partial sends
  }

  // FINAL SEND (WhatsApp Cloud API sends full message once)
  await sendWhatsApp(to, buffer);

  return true;
};