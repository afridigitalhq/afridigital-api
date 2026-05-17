const WebSocket=require('ws');
const bus=require('../events/event.bus');
const {getTraces}=require('../trace/afritrace.core');
const wss=new WebSocket.Server({port:7071});
console.log('📡 AFRITRACE LIVE ON :7071');
function send(d){const m=JSON.stringify(d);
wss.clients.forEach(c=>c.readyState===1&&c.send(m));}
wss.on('connection',ws=>{
ws.send(JSON.stringify({type:'init',payload:getTraces(50)}));
});
bus.on('*',send);
