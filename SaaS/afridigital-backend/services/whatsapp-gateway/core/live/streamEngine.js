const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
const sendWhatsApp = require('../sender/sendWhatsApp');

module.exports = async function streamWhatsAppReply(to, text){
  const safe = (text || '').toString();
  const chunks = safe.match(/.{1,40}/g) || [safe];

  let buffer = '';

  for(const chunk of chunks){
    await sleep(300 + Math.random()*600);

    buffer += chunk;

    // send progressive updates (real WhatsApp = last message wins)
    await sendWhatsApp(to, buffer);
  }

  return true;
};
