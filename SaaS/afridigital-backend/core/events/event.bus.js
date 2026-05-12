const { assertApiVersion } = require("../runtime/safety/api.guard");
const EventEmitter = require('events');
class AfriEventBus extends EventEmitter {}
module.exports = new AfriEventBus();
