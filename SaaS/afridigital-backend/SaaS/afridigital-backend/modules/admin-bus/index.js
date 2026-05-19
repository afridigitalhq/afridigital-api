const bus=[];module.exports={emit:(event)=>bus.push({event,time:Date.now()}),get:()=>bus};
