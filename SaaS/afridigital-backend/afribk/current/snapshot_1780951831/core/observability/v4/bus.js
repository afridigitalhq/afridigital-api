const EventEmitter = require("events");

/**
 * SINGLE GLOBAL OBSERVABILITY BUS
 * prevents duplicate emitter instances
 */
const bus = global.__OBS_BUS__ || new EventEmitter();

global.__OBS_BUS__ = bus;

module.exports = bus;
