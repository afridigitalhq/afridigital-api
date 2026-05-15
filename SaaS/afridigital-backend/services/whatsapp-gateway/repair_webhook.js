const fs = require('fs');

const f = './server.js';
let c = fs.readFileSync(f, 'utf8');

// remove any broken webhook block safely
c = c.replace(/app\.post\(['"]\/webhook['"][\s\S]*?\}\);?/g, '');

// rebuild clean webhook (SAFE STATIC STRING)
const webhook =
`app.post('/webhook', async (req, res) => {

  const text = req.body?.text || '';
  const from = req.body?.from || 'unknown';

  const trace = {
    stage: 'WHATSAPP_IN',
    from,
    text,
    ts: Date.now()
  };

  return res.json({
    ok: true,
    trace
  });

});`;

c += '\n\n' + webhook;

fs.writeFileSync(f, c);

console.log('🧠 WEBHOOK REPAIR COMPLETE (NO SHELL INTERFERENCE)');
