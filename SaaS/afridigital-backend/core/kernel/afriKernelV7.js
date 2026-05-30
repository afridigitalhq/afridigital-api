const { pop, requeue } = require("../queue/eventQueue");
const { heartbeat } = require("../watchdog/kernelWatchdog");

const { traceEvent, traceExecution } = require("../observe/tracer");
const { tick, fail } = require("../observe/metrics");

const runCommand = async ()=>({ok:true, fallback:true});
const { sendWhatsAppMessage } = require("../whatsapp/sender");

let running = false;

async function sleep(ms){
  return new Promise(r => setTimeout(r, ms));
}

async function loop(){

  if(running) return;
  running = true;

  console.log("🧠 V7 RECOVERY KERNEL START");

  while(true){

    try{

      const event = pop();

      if(!event){
        await sleep(400);
        continue;
      }

      heartbeat();

      traceEvent(event);

      traceExecution("event_received", {
        type: event.type || null
      });

      tick();

      if(
        event.type === "whatsapp_message" &&
        event.payload
      ){

        await runCommand(
          { body: event.payload },
          sendWhatsAppMessage
        );

      }

    } catch(e){

      fail();

      traceExecution("kernel_error", {
        error: e.message
      });

      requeue({
        type: "kernel_error",
        payload: e.message
      });

      console.log("⚠️ kernel error:", e.message);

      await sleep(1000);

    }

  }

}

undefined
