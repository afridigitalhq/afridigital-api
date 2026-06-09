const fs=require("fs");

function start(engine, interval=20000){
  setInterval(()=>{
    try{
      if(!engine?.memoryStore) return;

      const out={};
      for(const [k,v] of engine.memoryStore.entries()){
        out[k]=v;
      }

      fs.writeFileSync(
        "core/memory/snapshot/memory.json",
        JSON.stringify(out)
      );
    }catch(e){}
  }, interval);
}

module.exports = { start };
