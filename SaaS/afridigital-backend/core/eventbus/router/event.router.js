const { assertApiVersion } = require("../runtime/safety/api.guard");
const { on } =
require('../engine/event.bus');

function initEventRouter() {

  on('message_received', data => {
    console.log('📩 Message Received');
  });

  on('message_processed', data => {
    console.log('⚡ Message Processed');
  });

}

module.exports = {
  initEventRouter
};
