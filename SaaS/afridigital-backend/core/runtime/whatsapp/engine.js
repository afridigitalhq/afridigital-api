const { messageBrain } = require('../brain/message.brain');

async function handleMessage({ from, message }) {
  console.log('📩 ENGINE:', from, message);

  const reply = await messageBrain({ from, message });

  return { from, reply };
}

module.exports = { handleMessage };
