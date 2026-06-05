require('./workers/runtime/ai.worker');

const { publish } = require('./core/africore/mesh/producer');
const { waitForReply } = require('./core/africore/runtime/promiseStore');

(async () => {
  const id = 'boot-fixed';

  publish({
    from: 'user',
    text: 'hello brain',
    traceId: id
  });

  const res = await waitForReply(id, 5000);

  console.log("FINAL:", res);
})();
