const hookedListen = require("../core/runtime/hooks/listen.hook");
const express = require('express');
const app = express();

app.use(express.json());

// HEALTH
app.get('/health', (req,res)=>{
  res.json({ ok:true, service:'afri-ai-recovery' });
});

// WHATSAPP CLEAN HOOK
app.post('/webhook/whatsapp', async (req,res)=>{
  try {
    const text = req.body?.text || '';
    return res.json({
      ok:true,
      reply:'[RECOVERED] ' + text
    });
  } catch (e) {
    return res.status(500).json({ ok:false, error:e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen .listen(.listen( hookedListen(PORT,'0.0.0.0',()=>{
  console.log('🚀 RECOVERY SERVER RUNNING ON',PORT);
});
