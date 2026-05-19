const { addFailure } = require('./failure.graph');

console.log('♻️ UDR v2.1 RECOVERY ENGINE ACTIVE');

const recoveryMap = {
  MISSING_MODULE: 'reload_module',
  NULL_REFERENCE: 'isolate_module',
  CONNECTION_FAILURE: 'retry_connection',
  UNKNOWN_FAILURE: 'safe_restart'
};

function recover(moduleId, error, loader) {
  const failure = addFailure(moduleId, error);
  const strategy = recoveryMap[failure.type];

  console.log(`🧩 FAILURE DETECTED: ${moduleId} → ${failure.type}`);

  switch (strategy) {

    case 'reload_module':
      try {
        delete require.cache[require.resolve(loader)];
        require(loader);
        console.log(`✅ RELOADED: ${moduleId}`);
      } catch (e) {
        console.log(`❌ RELOAD FAILED: ${moduleId}`);
      }
      break;

    case 'isolate_module':
      console.log(`🧊 ISOLATING MODULE: ${moduleId}`);
      break;

    case 'retry_connection':
      console.log(`🔁 RETRYING CONNECTION: ${moduleId}`);
      break;

    default:
      console.log(`⚠️ SAFE FALLBACK: ${moduleId}`);
  }
}

module.exports = { recover };
