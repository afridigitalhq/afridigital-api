const tools = require("./tools");
const memory = require("../human/memory");

module.exports = async function runAgent({ intent, text, userId }){

  let result;

  if(intent === "get_time"){
    result = await tools.get_time();
  }

  else if(intent === "echo"){
    result = await tools.echo({ text });
  }

  else {
    result = "🤖 AfriAI: " + text;
  }

  const session = memory.get(userId);
  session.history.push({ role:"assistant", text: result });

  return result;
};
