const queue = require("./whatsappQueue");

module.exports = async function enqueueMessage(message) {
  await queue.add(message, {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000
    },
    removeOnComplete: true
  });
};
