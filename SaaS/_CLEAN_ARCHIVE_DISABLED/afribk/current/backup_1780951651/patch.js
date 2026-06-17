const fs = require('fs');

// =====================
// FIX SERVER ROUTES
// =====================
const file = './server.js';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes("routes/ai")) {
  s += "\napp.use('/api', require('./routes/ai'));";
  s += "\napp.use('/api', require('./routes/runtime'));";
  s += "\napp.use('/stream', require('./routes/stream'));";
}

fs.writeFileSync(file, s);
console.log("🚀 ROUTES PATCHED SAFELY");
