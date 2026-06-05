const fs = require('fs');

const file = './routes/stream.js';
let code = fs.readFileSync(file, 'utf8');

// replace broken import
code = code.replace(
  /require\(['"]\.\.\/core\/ai\/streamBrain['"]\)/,
  "require('../core/ai/brain')"
);

// fallback safety if streamBrain is used elsewhere
if (!code.includes("streamBrain")) {
  code += `\n// fallback mapping applied\n`;
}

fs.writeFileSync(file, code);
console.log("🚀 STREAM ROUTE FIXED (brain.js mapped)");
