const fs = require('fs');
const path = require('path');
const { pluginRegistry } = require('./index');

const watchDir = path.join(process.cwd(), 'core/ai/gateway/v5/plugins');

fs.watch(watchDir, { recursive: true }, (event, filename) => {
  if (!filename || !filename.endsWith('.js')) return;

  const full = path.join(watchDir, filename);

  console.log('🔔 CHANGE DETECTED:', full);

  try {
    pluginRegistry.reload(full);
  } catch (e) {
    console.error('❌ reload failed:', e.message);
  }
});
