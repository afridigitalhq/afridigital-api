const { dispatch } = require('../../afriai/registry/workerRegistry');
const { setReply } = require('../runtime/promiseStore');

function publish(message) {
  const payload = {
    ...message,
    createdAt: Date.now()
  };

  console.log("📨 DISPATCH:", payload.traceId);

  const result = dispatch(payload);

  if (result) {
    setReply(payload.traceId, result);
  }

  return payload.traceId;
}

module.exports = { publish };
