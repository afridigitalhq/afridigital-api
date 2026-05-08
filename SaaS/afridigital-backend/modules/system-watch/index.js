const pm2=require('pm2');
const alerts=require('../admin-alerts');

function scan(){
pm2.list((_,procs)=>{
const issues=(procs||[]).filter(p=>p.pm2_env.status!=='online');

if(issues.length){
alerts.send('admin',{
type:'SYSTEM_ALERT',
issues
});
}
});
}

setInterval(scan,120000);

module.exports={scan};