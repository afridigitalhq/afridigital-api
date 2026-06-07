const { onJob } = require('../queue/jobQueue');
const execute = require('../africore/runtime/execute');

onJob('api.ai', async (payload) => {
  const result = await execute('api.ai', payload);
  console.log("🧠 JOB COMPLETED:", result);
});
