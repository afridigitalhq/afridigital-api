const memory = require('./storage/memoryDB');

function sleep(ms){
  return new Promise(r=>setTimeout(r,ms));
}

function detectIntent(text){
  const t = (text||'').toLowerCase();
  if(t.includes('time')) return 'time';
  if(t.includes('echo')) return 'echo';
  return 'chat';
}

async function think(){
  const delay = 800 + Math.random()*1800;
  await sleep(delay);
}

module.exports = async function engine(userId,text){

  await think();

  const session = memory.get(userId);
  memory.push(userId,'user',text);

  let reply;

  const intent = detectIntent(text);

  if(intent === 'time'){
    reply = '⏱ AfriAI live time: ' + new Date().toISOString();
  }
  else if(intent === 'echo'){
    reply = text;
  }
  else {
    reply = '🤖 AfriAI thinking… ' + text;
  }

  memory.push(userId,'assistant',reply);

  return {
    type:'text',
    message: reply,
    intent
  };
};
