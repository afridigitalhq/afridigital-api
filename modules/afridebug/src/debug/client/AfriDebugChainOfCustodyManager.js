const records=[];

const Chain={

record(entry){

const record={
entryId:"CUSTODY-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),
evidenceId:entry.evidenceId,
action:entry.action,
performedBy:entry.performedBy,
location:entry.location||"AfriDebug Runtime",
timestamp:Date.now(),
timestampISO:new Date().toISOString()
};

records.push(record);
return record;

},

history(evidenceId){
return records.filter(r=>r.evidenceId===evidenceId);
},

health(){
return{
service:"AfriDebugChainOfCustodyManager",
records:records.length,
status:"healthy"
};
}

};

export default Chain;
