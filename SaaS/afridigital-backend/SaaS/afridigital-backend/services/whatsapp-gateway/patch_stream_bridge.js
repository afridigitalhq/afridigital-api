const fs = require('fs');

const f = './core/v8/trace.js';
let c = fs.readFileSync(f, 'utf8');

// ensure stream import exists safely
if (!c.includes("stream.publish")) {
  c = "const stream = require('../stream/bus');\n" + c;
}

// safe injection (no regex chaos)
const target = "console.log('[V8 TRACE]', JSON.stringify(event));";

if (c.includes(target)) {
  c = c.replace(
    target,
    target + "\nstream.publish({ type: 'trace', event });"
  );
}

fs.writeFileSync(f, c);

console.log("📡 STREAM BRIDGE CONNECTED (SAFE MODE)");
