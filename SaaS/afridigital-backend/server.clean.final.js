
const express = require('express');
const app = express();
app.use(express.json());

// HEALTH
app.get('/health', (req,res)=>{
  res.json({ ok:true, service:'afri-ai-clean' });
});

// WHATSAPP HOOK
app.post('/webhook/whatsapp', async (req,res)=>{
  try {
    const text = req.body?.text || '';
    return res.json({ ok:true, reply:'[CLEAN] '+text });
  } catch(e){
    return res.status(500).json({ ok:false, error:e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0',()=>{
  console.log('🚀 CLEAN SERVER RUNNING ON',PORT);
});
