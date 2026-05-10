const events=[];

module.exports={
emit:(e)=>events.push({...e,time:Date.now()}),
get:()=>events.slice(-100)
};