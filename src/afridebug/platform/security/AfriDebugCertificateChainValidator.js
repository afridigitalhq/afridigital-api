import TrustStore from "./AfriDebugTrustStore.js";
import CRL from "./AfriDebugCertificateRevocationList.js";

const Validator={

validate(cert){

const trust=TrustStore.isTrusted(cert.keyId);

const revoked=CRL.isRevoked(cert.certificateId);

return{
certificateId:cert.certificateId,
trusted:trust.trusted,
revoked:revoked.revoked,
valid:trust.trusted&&!revoked.revoked&&cert.status==="valid",
checkedAt:Date.now(),
checkedAtISO:new Date().toISOString()
};

},

health(){

return{
service:"AfriDebugCertificateChainValidator",
status:"healthy"
};

}

};

export default Validator;
