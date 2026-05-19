console.log('🚀 UDR v2.3 BOOT ORCHESTRATOR STARTING');

const registry = require('../udr/boot.registry');

const loadOrder = [
  'trace',
  'bus',
  'engine',
  'fusion',
  'websocket'
];

const state = {
  loaded: {},
  failed: [],
  startedAt: Date.now()
};

function load(id, path) {
  try {
    const mod = require(path);

    state.loaded[id] = {
      ok: true,
      ts: Date.now()
    };

    console.log(`✅ BOOT OK: ${id}`);
    return mod;
  } catch (e) {
    state.failed.push({ id, error: e.message });

    console.log(`❌ BOOT FAIL: ${id} → ${e.message}`);
    return null;
  }
}

function boot() {
  console.log('⚙️ UDR BOOT SEQUENCE INIT');

  for (const item of registry.bootOrder) {
    load(item.id, item.path);
  }

  console.log('🧠 BOOT COMPLETE');
  console.log({
    loaded: Object.keys(state.loaded).length,
    failed: state.failed.length
  });

  return state;
}

module.exports = { boot, state };
