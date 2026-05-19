const brain=require('../ai-brain');

function route(input){
const msg=(input.message||'').toLowerCase();
const userId=input.userId||'anon';

brain.remember(userId,msg);

if(msg.includes('remember')||msg.includes('before')) return {engine:'memory',reply:brain.recall(userId).slice(-3)};
if(msg.length<25) return {engine:'fast',reply:'👍 '+msg};

return {engine:'balanced',reply:'Processing AI context...'};
}

module.exports={route};