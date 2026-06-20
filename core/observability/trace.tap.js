
function createTraceTap(bus){
  return function trace(event, payload){
    const packet = {
      event,
      payload,
      time: Date.now()
    };

    console.log('📡 TRACE:', JSON.stringify(packet, null, 2));

    // forward to bus if exists
    if(bus && bus.emit){
      bus.emit('OBSERVABILITY_EVENT', packet);
    }

    return packet;
  };
}

module.exports = { createTraceTap };
