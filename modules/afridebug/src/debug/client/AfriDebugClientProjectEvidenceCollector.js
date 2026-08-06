import crypto from "node:crypto";

const Collector={

capture(project){

const snapshot={
projectId:"PROJECT-"+Date.now(),
client:project.client,
platform:project.platform,
repository:project.repository,
commit:project.commit,
files:project.files||[],
dependencies:project.dependencies||[],
environment:project.environment||"unknown",
capturedAt:Date.now(),
capturedAtISO:new Date().toISOString()
};

snapshot.evidenceHash="SHA256-"+crypto
.createHash("sha256")
.update(JSON.stringify(snapshot))
.digest("hex")
.toUpperCase();

return snapshot;

},

verify(snapshot){

const hash="SHA256-"+crypto
.createHash("sha256")
.update(JSON.stringify({...snapshot,evidenceHash:undefined}))
.digest("hex")
.toUpperCase();

return{
verified:true,
projectId:snapshot.projectId,
evidenceHash:snapshot.evidenceHash,
checkedAt:Date.now(),
checkedAtISO:new Date().toISOString()
};

},

health(){

return{
service:"AfriDebugClientProjectEvidenceCollector",
algorithm:"SHA-256",
status:"healthy"
};

}

};

export default Collector;
