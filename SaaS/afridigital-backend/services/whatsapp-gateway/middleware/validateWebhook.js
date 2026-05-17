const crypto=require('crypto');

module.exports=function validateWebhook(req,res,next){
  try{
    const signature=req.headers['x-hub-signature-256'];
    if(!signature) return res.status(401).send('Missing signature');

    const secret=process.env.WHATSAPP_APP_SECRET || '';
    const rawBody=req.rawBody || JSON.stringify(req.body);

    const expected='sha256=' + crypto
      .createHmac('sha256',secret)
      .update(rawBody)
      .digest('hex');

    if(!crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )){
      return res.status(403).send('Invalid signature');
    }

    // 🔐 Replay protection (basic)
    const msgId=req.headers['x-message-id'];
    if(msgId){
      global.__WHATSAPP_CACHE = global.__WHATSAPP_CACHE || new Set();
      if(global.__WHATSAPP_CACHE.has(msgId)){
        return res.status(200).send('Duplicate ignored');
      }
      global.__WHATSAPP_CACHE.add(msgId);
    }

    next();
  }catch(err){
    return res.status(500).send('Webhook validation error');
  }
};