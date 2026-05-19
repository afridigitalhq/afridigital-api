const ai=require('../../ai-entity-core');

async function handle(ctx){
const r=await ai.handle({
message:ctx.message.text,
userId:ctx.from.id,
channel:'telegram'
});
return ctx.reply(r.reply);
}

module.exports={handle};