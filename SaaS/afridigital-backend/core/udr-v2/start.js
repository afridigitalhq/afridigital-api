const { boot } = require('./boot.registry');
require('./self.healer');
require('./heartbeat');

console.log('🚀 UDR V2 STARTING...');

try {
  const state = boot();

  console.log('📊 UDR STATUS:', {
    loaded: Object.keys(state.loaded).length,
    failed: state.failed.length
  });

  console.log('🟢 UDR V2 ONLINE');
} catch (e) {
  console.log('🔥 CRITICAL BOOT FAILURE:', e.message);
  process.exit(1);
}
