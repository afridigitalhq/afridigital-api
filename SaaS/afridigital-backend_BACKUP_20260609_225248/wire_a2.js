const fs = require('fs');

const path = './server.js';
let code = fs.readFileSync(path, 'utf8');

// remove old webhook safely
code = code.replace(
  /app\.post\("\/webhook\/whatsapp"[\s\S]*?\}\);/g,
  ''
);

// inject clean A2 webhook
const patch = `
const a2Engine = require('./core/ai/gateway/v5/plugins/whatsapp/a2Engine');

app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const text = req.body?.text || '';

    const result = await a2Engine.enqueue({ text });

    return res.json({
      ok: true,
      engine: 'A2',
      queued: true,
      id: result.id
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});
`;

code += '\n' + patch;

fs.writeFileSync(path, code);

console.log('🚀 A2 WEBHOOK WIRED SAFELY');
