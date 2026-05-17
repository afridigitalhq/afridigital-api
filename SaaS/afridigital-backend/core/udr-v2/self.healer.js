const { state } = require('./boot.registry');
const registry = require('./boot.registry');

console.log('🛠️ UDR SELF-HEALER ACTIVE');

const healState = {
  cycles: 0,
  repairs: 0
};

// map module id → actual path
const moduleMap = {
  trace: '../runtime/trace/afritrace.core',
  bus: '../udr/udr.bus',
  engine: '../udr/udr.engine',
  fusion: '../udr-fusion/fusion.engine',
  websocket: '../udr/udr.websocket'
};

function heal() {
  healState.cycles++;

  const failures = state.failed || [];

  if (failures.length === 0) return;

  console.log(`🔧 HEAL CYCLE ${healState.cycles} → ${failures.length} issue(s)`);

  for (const f of failures) {
    const path = moduleMap[f.id];

    if (!path) {
      console.log(`⚠️ NO HEAL PATH FOR: ${f.id}`);
      continue;
    }

    try {
      console.log(`♻️ RELOADING MODULE: ${f.id}`);

      delete require.cache[require.resolve(path)];
      const mod = require(path);

      // mark recovered
      state.loaded[f.id] = { ok: true, ts: Date.now() };

      healState.repairs++;
      console.log(`✅ RECOVERED: ${f.id}`);
    } catch (e) {
      console.log(`❌ HEAL FAILED: ${f.id} → ${e.message}`);
    }
  }
}

setInterval(heal, 5000);

module.exports = { healState };
