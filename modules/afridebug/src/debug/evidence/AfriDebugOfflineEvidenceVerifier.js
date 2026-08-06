import crypto from "node:crypto";

const Verifier={

verify(pkg){

const calculated="SHA256-"+crypto.createHash("sha256").update(JSON.stringify(pkg.manifest)).digest("hex").toUpperCase();

return{
verified:calculated===pkg.checksum,
algorithm:"SHA-256",
expectedChecksum:pkg.checksum,
calculatedChecksum:calculated,
verifiedAt:Date.now(),
verifiedAtISO:new Date().toISOString()
};

},

health(){

return{
service:"AfriDebugOfflineEvidenceVerifier",
offline:true,
algorithm:"SHA-256",
status:"healthy"
};

}

};

export default Verifier;
