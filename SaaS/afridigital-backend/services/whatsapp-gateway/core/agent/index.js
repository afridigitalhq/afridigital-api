const memory = require("../human/memory");

function detectIntent(text){
  const t = text.toLowerCase();

  if(t.includes("time")) return "get_time";
  if(t.includes("echo")) return "echo";
  if(t.includes("help")) return "help";

  return "chat";
}

module.exports = async function agent(userId,text){

  const session = memory.get(userId);
  session.history.push({ role:"user", text });

  const intent = detectIntent(text);

  return {
    intent,
    text,
    userId
  };
};
