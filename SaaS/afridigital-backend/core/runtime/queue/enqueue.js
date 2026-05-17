const {read,write,init}=require('./store');
init();
function enqueue(job){
const q=read();
q.push({id:Date.now(),from:job.from,message:job.message,status:'pending',retries:0});
write(q);}
module.exports={enqueue};
