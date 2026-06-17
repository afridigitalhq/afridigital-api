const fs = require('fs');

const path = './server.js';

// backup
fs.writeFileSync('./server.backup.safe.js', fs.readFileSync(path, 'utf8'));

let code = fs.readFileSync(path, 'utf8');

// remove ALL webhook blocks safely
code = code.replace(/app\.post\(['"]\/webhook\/whatsapp['"][\s\S]*?\}\);/g, '');

// clean webhook (NO template strings inside bash)
const webhook =
"app.post('/webhook/whatsapp', async (req, res) => {\n" +
"  try {\n" +
"    const text = req.body?.text || '';\n" +
"    return res.json({ ok: true, reply: '[A2]' + text });\n" +
"  } catch (e) {\n" +
"    return res.status(500).json({ ok: false, error: e.message });\n" +
"  }\n" +
"});";

// append safely
code += "\n" + webhook;

// validate
require('vm').runInNewContext(code);

fs.writeFileSync(path, code);

console.log('🚀 A2 WEBHOOK CLEAN PATCH APPLIED');
