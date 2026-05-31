const { onJob } = require('../queue/jobQueue');
const execute = require('../africore/runtime/execute');

onJob('api.ai', async (payload) => {
  return await execute('api.ai', payload);
});

module.exports = { onJob };
