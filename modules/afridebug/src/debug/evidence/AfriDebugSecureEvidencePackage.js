import crypto from "node:crypto";

const Package={

create(evidence,signature,timestamp,ledger){

const packageId="PACKAGE-"+Date.now();

const manifest={
packageId,
version:"1.0",
algorithm:"SHA-256",
createdAt:Date.now(),
createdAtISO:new Date().toISOString(),
evidenceId:evidence.evidenceId,
incidentId:evidence.incidentId,
signature,
timestamp,
ledger
};

const checksum="SHA256-"+crypto.createHash("sha256").update(JSON.stringify(manifest)).digest("hex").toUpperCase();

return{
packageId,
manifest,
checksum,
verified:true
};

},

health(){
return{
service:"AfriDebugSecureEvidencePackage",
algorithm:"SHA-256",
status:"healthy"
};
}

};

export default Package;
