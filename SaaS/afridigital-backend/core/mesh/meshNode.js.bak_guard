const EventEmitter = require('events');
const GossipTransport = require('./gossipTransport');

class MeshNode extends EventEmitter {
  constructor(nodeId){
    super();

    this.nodeId = nodeId;
    this.transport = new GossipTransport(nodeId);

    this.seen = new Set();
    this.vectorClock = {};
  }

  connectPeer(url){
    this.transport.addPeer(url);
  }

  tick(){
    this.vectorClock[this.nodeId] =
      (this.vectorClock[this.nodeId] || 0) + 1;
  }

  emitEvent(type, payload, traceId){
    const event = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      type,
      payload,
      traceId,
      node: this.nodeId,
      clock: {...this.vectorClock}
    };

    this.tick();

    this.process(event);
    this.transport.broadcast(event);

    return event;
  }

  receive(event){
    this.process(event);
  }

  process(event){
    if(this.seen.has(event.id)) return;

    this.seen.add(event.id);

    // merge vector clock
    for(const k in event.clock){
      this.vectorClock[k] = Math.max(
        this.vectorClock[k] || 0,
        event.clock[k]
      );
    }

    this.emit(event.type, event);
  }
}

module.exports = new MeshNode(process.env.NODE_ID || 'local');

// peer registration (runtime safe)
module.exports.registerPeer = function(url){
  module.exports.transport.addPeer(url);
};

