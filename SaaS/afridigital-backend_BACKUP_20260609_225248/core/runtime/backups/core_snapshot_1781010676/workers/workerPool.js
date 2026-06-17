const { runCommand } = require("../../controllers/afriCommandEngineV6");
const { sendWhatsAppMessage } = require("../whatsapp/sender");
const { trace } = require("../scheduler/trace");

async function handle(event){
  if(!event) return;

  trace(event,"worker:start");

  if(event.type === "whatsapp_message"){
    await runCommand({ body: event.payload }, sendWhatsAppMessage);
  }

  trace(event,"worker:end");
}

module.exports = { handle };
