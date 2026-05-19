require("dotenv").config();
const express = require("express");
const app = express(); app.use(express.json());


const whatsappGateway = require('./services/whatsapp-gateway/server');

app.use(express.json());

app.get('/health', (req, res) => {
  return res.json({ ok: true, trace: true });
});

app.use('/whatsapp', whatsappGateway);

const PORT = process.env.PORT || 3000;



app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    console.log("📩 IN:", msg?.from, msg?.text?.body);

    res.sendStatus(200);
  } catch (e) {
    console.error("WEBHOOK ERROR:", e);
    res.sendStatus(200);
  }
});


app.get("/debug/env", (req, res) => {
  res.json({
    metaTokenLoaded: !!process.env.META_ACCESS_TOKEN,
    phoneIdLoaded: !!process.env.META_PHONE_NUMBER_ID,
    nodeEnv: process.env.NODE_ENV
  });
});

app.get("/debug/env", (req, res) => {
  res.json({
    metaTokenLoaded: !!process.env.META_ACCESS_TOKEN,
    phoneIdLoaded: !!process.env.META_PHONE_NUMBER_ID,
    nodeEnv: process.env.NODE_ENV
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 AFRIAI SERVER RUNNING ON PORT", PORT);
});

module.exports = app;


// === AFRIAI WEBHOOK (FORCED FIX) ===
app.get('/webhook',(req,res)=>{
  const mode=req.query['hub.mode'];
  const token=req.query['hub.verify_token'];
  const challenge=req.query['hub.challenge'];

  if(mode==='subscribe' && token===process.env.WHATSAPP_VERIFY_TOKEN){
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post('/webhook',async(req,res)=>{
const afriAiLoop = require('./core/realtime/afriai-loop');
  try{
    const msg=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg) return res.sendStatus(200);

    const from=msg.from;
    const text=msg.text?.body;

    console.log('IN:',from,text);

    const afriAiLoop=require('./core/realtime/afriai-loop');
    // afriAiLoop(
req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || '',
req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || ''

    res.sendStatus(200);
  }catch(e){
    console.error('WEBHOOK ERROR',e);
    res.sendStatus(200);
  }
});


// ===== AFRI V10.7 BRAIN CORE =====
const seenMessages = new Map();

function isDuplicate(id){
  if(!id) return false;
  if(seenMessages.has(id)) return true;
  seenMessages.set(id, Date.now());
  setTimeout(()=>seenMessages.delete(id), 5*60*1000);
  return false;
}

app.post('/webhook', async (req, res) => {
  console.log("RAW WEBHOOK BODY:", JSON.stringify(req.body, null, 2));
const afriAiLoop = require('./core/realtime/afriai-loop');
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg) return res.sendStatus(200);

    const id = msg.id || msg.timestamp;
    if(isDuplicate(id)) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text?.body;

    console.log('📩 IN:', from, text);

    // IMPORTANT: instant ACK
    res.sendStatus(200);

    // async AI processing (non-blocking)

  } catch(e){
    console.error('WEBHOOK ERROR:', e);
    res.sendStatus(200);
  }
});

console.log('🚀 V10.7 BRAIN ACTIVE');
