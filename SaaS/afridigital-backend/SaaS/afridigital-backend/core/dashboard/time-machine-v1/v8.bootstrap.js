const V8StreamBridge = require('../../afriai/v10_5/stream/v8.stream.bridge');
const traceBus = require('../../afriai/v10_5/observability/trace.bus.v10.5');

function attachV8(server) {
  if (!server) return;

  const bridge = new V8StreamBridge(
    server,
    traceBus,
    global.laneEngine
  );

  bridge.attach();
  global.v8Bridge = bridge;

  console.log('🚀 V8 PRODUCTION STREAM ACTIVE');
}

module.exports = { attachV8 };
