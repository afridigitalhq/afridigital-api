const { pop, requeue } = require("../scheduler/eventScheduler");
const { handle } = require("../workers/workerPool");
const { beat } = require("../supervisor/supervisor");

let running = false;

async function loop(){
  if(running) return;
  running = true;

  console.log("🧠 AFRI V8 KERNEL ONLINE");

  while(true){
    try{
      const event = pop();

      if(!event){
        await new Promise(r=>setTimeout(r,300));
        continue;
      }

      beat();

      await handle(event);

    }catch(e){
      requeue({ type:"error", payload:e.message });
    }
  }
}

module.exports = { loop };
