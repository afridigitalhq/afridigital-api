const fs = require('fs');

console.log('🧠 APPLYING EXACTLY-ONCE PATCH');

let f = fs.readFileSync('./core/workers/whatsappWorker.js','utf8').toString();

// 1. Add import safely
if (!f.includes('delivery/ledger')) {
  f = f.replace(
    'const queue = require',
    "const { isDelivered, markDelivered } = require('../delivery/ledger');\nconst queue = require"
  );
}

// 2. Add dedupe guard safely
if (!f.includes('isDelivered(msg.id)')) {
  f = f.replace(
    'const msg = job.data;',
    `const msg = job.data;

if (await isDelivered?.(msg.id)) {
  console.log('🟡 DUPLICATE BLOCKED:', msg.id);
  return;
}`
  );
}

// 3. Mark delivered after processing
if (!f.includes('markDelivered(msg.id)')) {
  f = f.replace(
    'await sendMessage(to, reply);',
    `await sendMessage(to, reply);
await markDelivered?.(msg.id);`
  );
}

fs.writeFileSync('./core/workers/whatsappWorker.js', f);

console.log('✔ EXACTLY-ONCE DELIVERY PATCH COMPLETE');
