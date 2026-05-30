const EventEmitter = require('events');

class DistributedMesh extends EventEmitter {
  constructor(nodeId){
    super();
    this.nodeId = nodeId;
    this.peers = new Map();
    this.vectorClock = {};
    this.seen = new Set();
  }

  connect(peerId, transport){
    this.peers.set(peerId, transport);
  }

  tick(node){
    this.vectorClock[node] = (this.vectorClock[node] || 0) + 1;
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

    this.tick(this.nodeId);
    this.broadcast(event);
    this.emit(type, event);

    return event;
  }

  receive(event){
    if(this.seen.has(event.id)) return;

    this.seen.add(event.id);

    // merge vector clock (causal sync)
    for(const n in event.clock){
      this.vectorClock[n] = Math.max(
        this.vectorClock[n] || 0,
        event.clock[n]
      );
    }

    this.emit(event.type, event);
  }

  broadcast(event){
    for(const [peerId, transport] of this.peers){
      try{
        transport.send(event);
      }catch(e){}
    }
  }
}

module.exports = DistributedMesh;
