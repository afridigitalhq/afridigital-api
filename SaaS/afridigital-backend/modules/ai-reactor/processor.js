const { stream } = require('../memory-stream/stream');

function process(event) {
  const history = stream(event);
  
  return {
    context: history.slice(-10),
    event
  };
}

module.exports = { process };
