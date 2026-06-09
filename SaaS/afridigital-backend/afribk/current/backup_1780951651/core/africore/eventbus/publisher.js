const bus = require('./bus');

async function emit(event){
  return await bus.publish("afri-events", event);
}

module.exports = { emit };
