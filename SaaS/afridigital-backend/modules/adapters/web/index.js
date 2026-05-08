const ai=require('../../ai-entity-core');

async function handle(message,sessionId){
return ai.handle({
message,
userId:sessionId,
channel:'web'
});
}

module.exports={handle};