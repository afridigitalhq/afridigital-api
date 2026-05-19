const fs = require('fs');

const f = './server.js';
let c = fs.readFileSync(f, 'utf8');

// inject memory safely (idempotent)
if (!c.includes('AFRIMEM')) {

  const memBlock = `
const AFRIMEM = new Map();
`;

  c = memBlock + '\n' + c;

  c = c.replace(
    'app.post(\'/webhook\'',
    `app.post('/webhook', (req, res) => {

  const sessionId = req.body?.from || 'unknown';

  if (!AFRIMEM.has(sessionId)) {
    AFRIMEM.set(sessionId, []);
  }

  AFRIMEM.get(sessionId).push(req.body?.text || '');

`
  );

  fs.writeFileSync(f, c);
  console.log('🧠 MEMORY PATCH APPLIED CLEANLY');
} else {
  console.log('⚡ MEMORY ALREADY EXISTS');
}
