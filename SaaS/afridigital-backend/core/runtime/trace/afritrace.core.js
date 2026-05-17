const bus = require('../events/event.bus');
const store = [];
function logTrace(type,payload){
const t={id:Date.now()+'_'+Math.random().toString(36).slice(2),type,payload,ts:Date.now()};
store.push(t); if(store.length>5000)store.shift();
bus.emitEvent('trace',t); return t;
}
function getTraces(n=100){return store.slice(-n);}
module.exports={logTrace,getTraces};
