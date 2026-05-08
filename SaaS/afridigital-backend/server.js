const { runDiagnosis } = require('./core/v22/engine');
console.log('🧠 V22 REASONING CORE ACTIVE');
const { runDevOpsCheck } = require('./core/devops-ai');
runDevOpsCheck();
const { bootGuard } = require('./core/guardian');
bootGuard();
require('./core/boot');
