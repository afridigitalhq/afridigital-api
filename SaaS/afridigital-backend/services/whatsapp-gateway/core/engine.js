const memory = require("./human/memory");
const think = require("./human/think");

module.exports = async function engine(userId,text){

  const session = memory.get(userId);
  session.history.push({ role:"user", text, ts:Date.now() });

  // 🧠 simulate thinking
  await think();

  if(!text){
    return {type:"text", message:"Send a message"};
  }

  // simple memory-aware reply
  const last = session.history.slice(-2);

  const reply = "🤖 AfriAI: " + text + " (memory active)";

  session.history.push({ role:"assistant", text:reply, ts:Date.now() });

  return { type:"text", message: reply };
};
