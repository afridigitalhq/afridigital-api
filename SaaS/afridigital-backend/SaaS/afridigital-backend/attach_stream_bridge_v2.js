const fs = require('fs');

const f = './core/dashboard/time-machine-v1/server.js';

let c = fs.readFileSync(f, 'utf8');

// prevent duplicate install
if (!c.includes('StreamBridgeV2')) {

  const inject =
`const StreamBridgeV2 = require('../../runtime/stream.bridge.v2');
const traceBus = require('../../afriai/v10_5/observability/trace.bus.v10.5');`;

  c = inject + "\n" + c;

  if (!c.includes('StreamBridgeV2(server')) {
    c += `

// STREAM BRIDGE v2 BOOT
if (typeof server !== 'undefined') {
  new StreamBridgeV2(server, traceBus);
}
`;
  }

  fs.writeFileSync(f, c);
}

console.log('🚀 STREAM BRIDGE v2 ATTACHED (SAFE MODE)');
