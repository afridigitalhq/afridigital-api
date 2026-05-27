const { route } = require("../intelligence/router");
const { recall, remember } = require("../memory/memoryStore");
const { sendWhatsAppMessage } = require("../whatsapp/sender");
const { log } = require("../analytics/metrics");

async function handle(event){
  if(!event) return;

  const from = event.payload?.from || "unknown";
  const text = event.payload?.text || "";

  const decision = route(event);

  try{

    if(decision === "memory_query"){
      const mem = recall(from);
      await sendWhatsAppMessage(from, JSON.stringify(mem,null,2));
    }

    if(decision === "ai_query"){
      remember(from, "last_query", text);
      await sendWhatsAppMessage(from, "🧠 AI layer ready (hook OpenAI here)");
    }

    if(decision === "command_exec"){
      remember(from, "last_command", text);
      await sendWhatsAppMessage(from, "⚙️ Executed: " + text);
    }

    log(event, "success");

  }catch(e){
    log(event, "error");
    await sendWhatsAppMessage(from, "❌ execution error");
  }
}

module.exports = { handle };
