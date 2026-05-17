function claimJob(q,w){
for(let j of q){if(j.status==='pending'){j.status='locked';j.lockedBy=w;j.lockedAt=Date.now();return j;}}
return null;}
function releaseStuck(q,t=60000){
const n=Date.now();
for(let j of q){if(j.status==='locked'&&n-j.lockedAt>t){j.status='pending';j.lockedBy=null;}}}
module.exports={claimJob,releaseStuck};
