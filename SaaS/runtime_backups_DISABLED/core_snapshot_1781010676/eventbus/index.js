const EventEmitter = require('events');

/**
 * AFRI EVENT BUS - STABLE BASELINE
 * Clean reset for SSE + AI + WhatsApp pipeline
 */

class Bus extends EventEmitter {}

const bus = new Bus();

module.exports = bus;
