const fs = require('fs');

let c = fs.readFileSync('server.js', 'utf8');

console.log("🧠 STARTING CLEAN RECOVERY");

// remove broken tokens
c = c.replace(/undefined;/g, '');

// remove stray isolated braces after require lines
c = c.replace(/require\([^)]+\);\s*\n\}/g, (m) => {
  return m.split('}\n')[0] + '\n';
});

// ensure single module export
c = c.replace(/module\.exports\s*=\s*app;[\s\S]*/g, 'module.exports = app;');

// remove trailing broken braces
while (c.trim().endsWith('}')) {
  c = c.trim().slice(0, -1);
}

// ensure listener exists
if (!c.includes('app.listen')) {
  c += `

const PORT = process.env.PORT || 10000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 V8 CLEAN RECOVERY MODE', PORT);
  });
}
`;
}

fs.writeFileSync('server.js', c);

console.log("🧼 SERVER RECOVERY COMPLETE");
