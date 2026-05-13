const hub = require("../realtime/event.hub");

class ClusterV2 {
  constructor() {
    this.buffer = [];
  }

  emit(event) {
    const normalized = {
      ...event,
      cluster: "AFRIBANK-CLUSTER-V2",
      ts: Date.now()
    };

    this.buffer.push(normalized);

    if (this.buffer.length > 500) {
      this.buffer.shift();
    }

    hub.emitEvent(normalized);

    return {
      ok: true,
      cluster: "v2",
      stored: this.buffer.length
    };
  }

  replay(limit = 50) {
    return {
      ok: true,
      cluster: "v2",
      events: this.buffer.slice(-limit)
    };
  }
}

module.exports = new ClusterV2();

// V4 VALIDATION HOOK
function isValidEvent(e){
  return e && typeof e === 'object' && e.type && e.category;
}

const _emit = ClusterV2.prototype.emit;
ClusterV2.prototype.emit = function(event){
  if(!isValidEvent(event)) return { ok:false, error:'invalid_event' };
  return _emit.call(this,event);
};
