console.log('⚙️ UDR BOOT REGISTRY INITIALIZING');

const bootOrder = [
  {
    id: 'trace',
    path: '../runtime/trace/afritrace.core',
    critical: true
  },
  {
    id: 'bus',
    path: '../udr/udr.bus',
    critical: true
  },
  {
    id: 'engine',
    path: '../udr/udr.engine',
    critical: true
  },
  {
    id: 'fusion',
    path: '../udr-fusion/fusion.engine',
    critical: true
  },
  {
    id: 'websocket',
    path: '../udr/udr.websocket',
    critical: false
  }
];

const state = {
  loaded: {},
  failed: [],
  startedAt: Date.now()
};

function loadModule(item) {
  try {
    const mod = require(item.path);
    state.loaded[item.id] = {
      ok: true,
      ts: Date.now()
    };
    console.log(`✅ BOOT OK: ${item.id}`);
    return mod;
  } catch (err) {
    state.failed.push({
      id: item.id,
      error: err.message
    });

    console.log(`❌ BOOT FAIL: ${item.id} → ${err.message}`);

    if (item.critical) {
      throw new Error(`CRITICAL MODULE FAILURE: ${item.id}`);
    }
  }
}

function boot() {
  console.log('🚀 UDR V2 BOOT SEQUENCE START');

  for (const item of bootOrder) {
    loadModule(item);
  }

  console.log('🧠 BOOT COMPLETE');
  return state;
}

module.exports = { boot, state };
