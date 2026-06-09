const controller = require('../whatsapp/controller');
const { attachReplayDecision } = require('./replay.wire');

async function handleMessage(payload) {
  const result = await controller.handleMessage(payload);
  return attachReplayDecision(result, payload);
}

module.exports = {
  handleMessage
};
