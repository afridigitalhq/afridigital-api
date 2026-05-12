const setupWebhook = require('./webhook.fix');
process.on('uncaughtException', e => console.error('CRASH SAFE:', e));
process.on('unhandledRejection', e => console.error('PROMISE SAFE:', e));

require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

// BOOT CORE SYSTEM
try { require('./core/bootstrap/v8.kernel').boot(app); } catch(e) { console.log('BOOT SKIPPED', e.message); }
app.use('/control', require('./routes/control.routes'));
if (process.env.ENABLE_WORKERS === 'true') {
  require('./workers/cluster.worker');
}
if (process.env.ENABLE_WORKERS === 'true') {
  require('./workers/retry/worker');
}

// ROUTES
app.use('/dashboard', require('./routes/dashboard.routes'));// REMOVED WEBHOOK ROUTE FILE CONFLICT
app.use('/health', require('./routes/health.routes'));

const PORT = process.env.PORT || 10000;

function buildAfriAiResponse(message){
message=(message||"").toLowerCase();
if(message.includes("hello")){
return {type:"text",content:"👋 Hello! AfriAi is active."};
}
if(message.includes("wallet")){
return {
type:"card",
content:{
title:"💳 Wallet Status",
value:"40 coins",
actions:[
{label:"View History",action:"view_history"},
{label:"Send Coins",action:"send_coins"}
]
}
};
}
return {type:"text",content:"AfriAi understands your message."};
}

app.post("/afriai/chat",(req,res)=>{
const message=req.body.message||"";
const response=buildAfriAiResponse(message);
console.log("[AFRIAI]",message);
res.json({success:true,response});
});

const axios = require("axios");

app.get("/webhook", (req,res)=>{const mode=req.query["hub.mode"];const token=req.query["hub.verify_token"];const challenge=req.query["hub.challenge"];const VERIFY_TOKEN=process.env.WHATSAPP_VERIFY_TOKEN;if(!VERIFY_TOKEN){return res.sendStatus(500);}if(mode==="subscribe" && token===VERIFY_TOKEN){return res.status(200).send(challenge);}return res.sendStatus(403);});

async function sendWhatsAppMessage(to,text){
try{
await axios.post(`https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_ID}/messages`,{
messaging_product:"whatsapp",
to,
text:{body:text}
},{
headers:{
Authorization:`Bearer ${process.env.WHATSAPP_TOKEN}`,
"Content-Type":"application/json"
}
});
}catch(err){
console.log("WhatsApp Send Error",err.response?.data||err.message);
}
}

app.post("/webhook",async(req,res)=>{
try{
const body=req.body;
const msg=body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
if(msg){
const from=msg.from;
const text=msg.text?.body||"";
console.log("[WHATSAPP]",from,text);
const ai=buildAfriAiResponse(text);
const reply=ai.content?.value||ai.content||"AfriAi active";
await sendWhatsAppMessage(from,String(reply));
}
res.sendStatus(200);
}catch(err){
console.log(err);
res.sendStatus(500);
}
});

app.listen(PORT, () => {
  console.log("🚀 V8.20 CLEAN KERNEL RUNNING", PORT);
});


app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});
setupWebhook(app, sendWhatsAppMessage, buildAfriAiResponse);
