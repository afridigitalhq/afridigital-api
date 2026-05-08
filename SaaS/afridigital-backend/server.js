const { runDevOpsCheck } = require('./core/devops-ai');
runDevOpsCheck();
const { bootGuard } = require('./core/guardian');
bootGuard();
require('./core/boot');
