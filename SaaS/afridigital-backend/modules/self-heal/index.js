const pm2=require('pm2');
const MAX_RESTARTS=5;

function heal(){
pm2.list((_,list)=>{
(list||[]).forEach(p=>{
const restarts=p.pm2_env.restart_time||0;

if(p.pm2_env.status!=='online' && restarts<MAX_RESTARTS){
pm2.restart(p.name);
}
});
});
}

setInterval(heal,180000);

module.exports={heal};