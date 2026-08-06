import fs from "node:fs";
import path from "node:path";

const Bundle={

create(pkg,certificate,publicKey){

const dir=path.join(".afridebug","bundle",pkg.packageId);

fs.mkdirSync(dir,{recursive:true});

fs.writeFileSync(path.join(dir,"evidence.json"),JSON.stringify(pkg,null,2));
fs.writeFileSync(path.join(dir,"certificate.json"),JSON.stringify(certificate,null,2));
fs.writeFileSync(path.join(dir,"public.pem"),publicKey);

const verify=`import fs from "node:fs";
import crypto from "node:crypto";

const evidence=JSON.parse(fs.readFileSync("evidence.json","utf8"));
const cert=JSON.parse(fs.readFileSync("certificate.json","utf8"));

const checksum="SHA256-"+crypto.createHash("sha256").update(evidence.checksum).digest("hex").toUpperCase();

console.log("========== OFFLINE VERIFICATION ==========");
console.log({
checksumValid:checksum===cert.fingerprint,
packageId:evidence.packageId,
evidenceId:evidence.manifest.evidenceId,
incidentId:evidence.manifest.incidentId,
verifiedAt:new Date().toISOString()
});
`;

fs.writeFileSync(path.join(dir,"verify.js"),verify);

return{
bundleDirectory:dir,
status:"created"
};

},

health(){

return{
service:"AfriDebugPortableVerificationBundle",
status:"healthy"
};

}

};

export default Bundle;
