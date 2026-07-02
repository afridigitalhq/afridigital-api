const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");
fs.mkdirSync(OUT,{recursive:true});

fs.writeFileSync(path.join(OUT,"ws-adapter.js"),`
function createWSAdapter(bus){

  return {

    publish(type,payload){
      bus.publish(type,payload);
    },

    subscribe(type,handler){
      return bus.subscribe(type,handler);
    }

  };

}

module.exports={ createWSAdapter };
`);

console.log("🟢 WS ADAPTER BUILT");
console.log("📦 OUTPUT:",OUT);
