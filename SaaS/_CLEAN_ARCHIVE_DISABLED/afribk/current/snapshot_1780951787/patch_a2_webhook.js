const fs = require('fs');

const path = './server.js';

// backup
fs.writeFileSync('./server.backup.safe.js', fs.readFileSync(path, 'utf8'));

let code = fs.readFileSync(path, 'utf8');

/**
 * 1. remove ALL old webhook versions safely
 */
code = code.replace(/app\.post\(['"]\/webhook\/whatsapp['"][\s\S]*?\}\);/g, '');

/**
 * 2. build clean webhook (NO TEMPLATE STRINGS INSIDE NODE - SAFE STRING ONLY)
 */
const webhook =
[
"const whatsappDelivery = require('./core/ai/gateway/v5/plugins/whatsapp/delivery');",
"",
"app.post('/webhook/whatsapp', async (req, res) => {",
"  try {",
"    const text = req.body?.text || '';",
"",
"    const reply = '[A2-CLEAN] ' + text;",
"",
"    await whatsappDelivery.enqueue({",
"      text: text,",
"      meta: { source: 'whatsapp' }",
"    });",
"",
"    return res.json({",
"      ok: true,",
"      reply: reply,",
"      streamed: true,",
"      provider: 'a2-clean'",
"    });",
"",
"  } catch (e) {",
"    return res.status(500).json({ ok: false, error: e.message });",
"  }",
"});"
].join('\n');

/**
 * 3. append safely
 */
code += '\n\n' + webhook;

fs.writeFileSync(path, code);

console.log('🚀 WHATSAPP ROUTE HARD RESET COMPLETE (SAFE FILE MODE)');
