const fs = require('fs');

let f = fs.readFileSync('./core/engine/flowEngine.js','utf8').toString();

console.log('🧠 Upgrading AfriAI Brain Layer...');

// 1. Safe text normalization
f = f.replace(
  'const text = (message.text || "").toLowerCase();',
  `
const text =
  typeof message.text === 'string'
    ? message.text.toLowerCase()
    : (message.text?.body || '').toLowerCase();
`
);

// 2. Wrap AI response
f = f.replace(
  'const ai = await askAfriAI(message);',
  `
const ai = await askAfriAI({
  text,
  from: message.from,
  messageId: message.id
});
`
);

// 3. Safe response output
f = f.replace(
  'return ai.reply;',
  `
return ai?.reply || "⚠️ AI temporarily unavailable";
`
);

fs.writeFileSync('./core/engine/flowEngine.js', f);

console.log('✔ AfriAI Brain Layer upgraded');
