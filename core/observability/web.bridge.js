
const EventEmitter = require('events');
const bridge = new EventEmitter();

function connect(){
  console.log('🌐 Web bridge initialized (mock mode)');
  return bridge;
}

module.exports = { connect, bridge };
