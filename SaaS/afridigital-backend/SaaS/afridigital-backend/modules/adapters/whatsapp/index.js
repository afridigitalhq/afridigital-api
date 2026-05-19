const ai=require('../../ai-entity-core');

async function handle(req,res){
const reply=await ai.handle({
message:req.body?.text,
userId:req.body?.from,
channel:'whatsapp'
});
res.json({reply:reply.reply});
}

module.exports={handle};