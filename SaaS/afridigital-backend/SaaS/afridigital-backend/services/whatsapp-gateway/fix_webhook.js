const fs = require('fs');

const f = './server.js';
let c = fs.readFileSync(f, 'utf8');

// remove broken orphan response block if it exists
c = c.replace(/res\.json\(\{[\s\S]*?\}\);\s*/g, '');

// ensure webhook exists only once
if (!c.includes("app.post('/webhook'")) {

  const webhook = `
app.post('/webhook', async (req, res) => {

  const text = req.body?.text || '';
  const from = req.body?.from || 'unknown';

  const lane = new LaneEngine().route(text);
  const response = generateReply(text, lane, { explain: () => lane });

  trace({ stage: 'WHATSAPP_IN', from, text, lane });

  return res.json({
    ok: true,
    lane,
    response
  });
});
`;

  c += webhook;
}

fs.writeFileSync(f, c);

console.log('🚀 WEBHOOK CLEAN REBUILD COMPLETE');
