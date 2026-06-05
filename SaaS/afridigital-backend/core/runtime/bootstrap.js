const express = require('express');

function createApp() {
  const app = express();

  app.use(express.json());

  // CORE CONTRACT ROUTES
  app.get('/health', (req,res)=> {
    res.json({ ok:true, service:'afridigital-api' });
  });

  app.get('/ready', (req,res)=> {
    res.json({ ok:true, status:'ready' });
  });

  app.get('/metrics', (req,res)=> {
    res.json({
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  });

  
  // FLOWGRAPH ENGINE START 
  const nodes = ["API","Kernel","EventBus","AI Brain","Database"]; 
  let i = 0; 
  app.get("/flow/event",(req,res)=>{ 
    const node = nodes[i++ % nodes.length]; 
    res.json({ id:"evt_"+Date.now(), node, action:"execute", status:"running", timestamp:Date.now() }); 
  }); 
  // FLOWGRAPH ENGINE END
  app.get('/dashboard', (req, res) => {
    const html = require('fs').readFileSync(
      'core/observability/v4/dashboard/index.html',
      'utf8'
    );
    res.setHeader('Content-Type','text/html');
    res.send(html);
  });

  return app;
}

module.exports = createApp;
