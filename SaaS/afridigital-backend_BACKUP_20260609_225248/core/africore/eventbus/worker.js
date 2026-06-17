const bus = require('./bus');

async function process(handler){

  while(true){
    const event = bus.consume();

    if(!event){
      await new Promise(r => setTimeout(r, 100));
      continue;
    }

    try {
      await handler(event);
    } catch (e) {
      console.log("EVENT_ERROR:", e.message);
    }
  }
}

module.exports = { process };
