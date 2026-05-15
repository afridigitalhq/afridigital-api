const fs = require('fs');

const f = './core/afriai/v10_5/observability/trace.bus.v10.5.js';

let c = fs.readFileSync(f, 'utf8');

// safety check
if (!c.includes('STREAM_CORE_ACTIVE')) {

  // add emitter import
  if (!c.includes('EventEmitter')) {
    c = "const EventEmitter = require('events');\n" + c;
  }

  // inject stream safely
  c = c.replace(
    'constructor() {',
    `constructor() {
    this.stream = new EventEmitter();`
  );

  c = c.replace(
    'this.traces.push(trace);',
    `this.traces.push(trace);
    this.stream.emit('trace', trace);`
  );

  c += `

// STREAM CORE ACTIVE FLAG
const STREAM_CORE_ACTIVE = true;
`;

}

fs.writeFileSync(f, c);

console.log("🚀 STREAM CORE INSTALLED SAFELY");
