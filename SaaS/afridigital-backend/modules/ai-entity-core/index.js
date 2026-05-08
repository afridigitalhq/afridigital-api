const memory=require('../ai-brain');const router=require('../llm-gateway');

function resolve(input){
return {
userId:input.userId||input.from||input.sessionId||'anon',
channel:input.channel||'web'
};
}

async function handle(input){
const {userId,channel}=resolve(input);

const context={userId,channel,message:input.message};

const result=router.route(context);

memory.remember(userId,input.message);

return {reply:result.reply||result,engine:result.engine,userId};
}

module.exports={handle};