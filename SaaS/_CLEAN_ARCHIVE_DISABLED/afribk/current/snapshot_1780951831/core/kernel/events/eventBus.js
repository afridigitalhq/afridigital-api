const EventEmitter = require("events");
class KernelEventBus extends EventEmitter {}
module.exports = new KernelEventBus();
