const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");
fs.mkdirSync(OUT,{recursive:true});

const src=`const { EventEmitter } = require("events");

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
`;

fs.writeFileSync(path.join(OUT,"eventbus.js"),src);

console.log("🟢 EVENT BUS BUILDER COMPLETE");
console.log("📦 OUTPUT:",OUT);
