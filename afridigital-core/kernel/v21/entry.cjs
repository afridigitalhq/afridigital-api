const { processResponse } = require("./core.pipeline.cjs");

function handleMessage(msg) {

  const result = processResponse({
    text: msg.text,
    user: msg.user
  });

  return result;
}

module.exports = { handleMessage };
