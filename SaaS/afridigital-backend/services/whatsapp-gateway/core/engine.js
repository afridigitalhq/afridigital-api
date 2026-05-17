const memory = require('./human/memory');
const think = require('./human/think');

module.exports = async function engine(userId,text){

  await (think?.() || new Promise(r=>setTimeout(r,1000)));

  const session = memory.get(userId);
  session.history.push({ role:'user', text });

  let reply;

  if(!text) reply = 'Send a message';
  else if(text.toLowerCase().includes('time')) reply = '⏱ AfriAI is alive';
  else reply = '🤖 AfriAI: ' + text;

  session.history.push({ role:'assistant', text: reply });

  return { type:'text', message: reply };
};