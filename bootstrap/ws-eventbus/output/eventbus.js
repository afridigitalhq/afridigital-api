const { EventEmitter } = require("events");

const bus=new EventEmitter();

bus.setMaxListeners(100);

function publish(channel,payload){
  bus.emit(channel,payload);
}

function subscribe(channel,handler){
  bus.on(channel,handler);
  return ()=>bus.off(channel,handler);
}

module.exports={
  bus,
  publish,
  subscribe
};
