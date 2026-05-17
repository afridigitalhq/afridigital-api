const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

module.exports = async function streamWhatsAppReply(to, text, send){
  const chunks = text.match(/.{1,40}/g) || [text];

  for(const c of chunks){
    await sleep(400 + Math.random()*700);
    console.log("📡 TYPING:", c);

    if(send) await send(c);
  }

  return true;
};
