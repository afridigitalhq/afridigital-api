const aiBrain = require('./core/ai/brain');
const orchestrator = require('./core/ai/orchestrator');
const identity = require('./core/identity');
const realtime = require('./core/realtime');

function start(app){
  try {

    if(aiBrain?.init) aiBrain.init();
    if(orchestrator?.init) orchestrator.init();
    if(identity?.init) identity.init();
    if(realtime?.init) realtime.init({ app });

    console.log('🧠 AFRIDIGITAL BOOTSTRAP ACTIVE');

  } catch (e) {
    console.log('⚠ BOOTSTRAP ERROR:', e.message);
  }
}

module.exports = { start };
