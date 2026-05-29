const { recall } = require("../memory/memoryStore");

function route(event){
  const text = (event.payload?.text || "").toLowerCase();

  // simple decision intelligence layer
  if(text?.includes("status")) return "system_status";
  if(text?.includes("memory")) return "memory_query";
  if(text.startsWith("afri ask")) return "ai_query";

  return "command_exec";
}

module.exports = { route };
