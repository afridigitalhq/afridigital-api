const router=require('./plugin.event.router');
const subscriptions=require('../subscription/plugin.subscription.manager');

function dispatch(source,type,payload={}){
  const targets=subscriptions.subscribers(type);

  const delivered=[];

  for(const target of targets){
    router.dispatch(source,target,type,payload);
    delivered.push(target);
  }

  return{
    ok:true,
    source,
    type,
    delivered,
    total:delivered.length
  };
}

module.exports={
  dispatch
};
