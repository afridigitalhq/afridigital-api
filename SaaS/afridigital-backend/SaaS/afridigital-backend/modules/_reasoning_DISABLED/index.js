const persona=require('../modules/persona');
const memory=require('../memory-v2');
const memory=require('../memory');function generate({userId,message,channel}){const history=memory.search(userId,message)||[];const last=history.slice(-5).map(m=>m.message).join(' | ');if(message.toLowerCase().includes('hello'))return 'Hey 👋 I am here. How can I help you today?';if(last)return 'From what I remember about you: '+last;return 'Got it. Tell me more.';}module.exports={generate};
