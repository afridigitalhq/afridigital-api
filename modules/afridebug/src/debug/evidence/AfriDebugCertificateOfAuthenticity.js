import crypto from "node:crypto";

const Certificate={

generate(pkg){
const fingerprint="SHA256-"+crypto.createHash("sha256").update(pkg.checksum).digest("hex").toUpperCase();

return{
certificateId:"CERT-"+Date.now(),
packageId:pkg.packageId,
evidenceId:pkg.manifest.evidenceId,
incidentId:pkg.manifest.incidentId,
algorithm:"SHA-256",
fingerprint,
issuedBy:"AfriDebug Certificate Authority",
issuedAt:Date.now(),
issuedAtISO:new Date().toISOString(),
status:"valid"
};
},

verify(cert,pkg){
const fingerprint="SHA256-"+crypto.createHash("sha256").update(pkg.checksum).digest("hex").toUpperCase();

return{
verified:fingerprint===cert.fingerprint,
certificateId:cert.certificateId,
checkedAt:Date.now(),
checkedAtISO:new Date().toISOString()
};
},

health(){
return{
service:"AfriDebugCertificateOfAuthenticity",
algorithm:"SHA-256",
status:"healthy"
};
}

};

export default Certificate;
