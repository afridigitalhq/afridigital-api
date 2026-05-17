const memory = require('../human/memory');
const think = require('../human/think');

module.exports = async function engine(userId, text){

  // store user input
  memory.push(userId,'user',text);

  // simulate thinking
  await think();

  // simple intelligence layer (LLM will replace later)
  if(text.toLowerCase().includes('hello')){
    return { type:'text', message:'👋 Hey! I am AfriAI. I am alive now.' };
  }

  if(text.toLowerCase().includes('time')){
    return { type:'text', message:'⏱ I am thinking... time module not fully wired yet.' };
  }

  return {
    type:'text',
    message:'🤖 AfriAI active: ' + text
  };
};