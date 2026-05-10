const EventEmitter = require('events');
class AfriEventBus extends EventEmitter {}
module.exports = new AfriEventBus();
