import TrustStore from "./AfriDebugTrustStore.js";
import CRL from "./AfriDebugCertificateRevocationList.js";
import ChainValidator from "./AfriDebugCertificateChainValidator.js";
import ZeroTrust from "./AfriDebugZeroTrustVerificationEngine.js";
import Policy from "./AfriDebugEnterpriseTrustPolicyEngine.js";
import Rotation from "./AfriDebugKeyRotationManager.js";
import HSM from "./AfriDebugHSMProvider.js";

const Orchestrator={
verify(certificate={}){
const trusted=TrustStore.isTrusted(certificate.keyId);
const revoked=CRL.isRevoked(certificate.certificateId);
const chain=ChainValidator.validate(certificate);
const zeroTrust=ZeroTrust.verify(certificate);
const policy=Policy.evaluate(certificate);
const rotation=Rotation.check?Rotation.check(certificate):{status:"healthy"};
const hsm=HSM.health();

const allow=
trusted &&
!revoked &&
chain.valid===true &&
zeroTrust.decision==="allow" &&
policy.allowed===true;

return{
certificateId:certificate.certificateId,
trusted,
revoked,
chain,
zeroTrust,
policy,
rotation,
hsm,
decision:allow?"ALLOW":"DENY",
verifiedAt:Date.now(),
verifiedAtISO:new Date().toISOString()
};
},
health(){
return{
service:"AfriDebugEnterpriseTrustOrchestrator",
components:[
TrustStore.health(),
CRL.health(),
ChainValidator.health(),
ZeroTrust.health(),
Policy.health(),
Rotation.health(),
HSM.health()
],
status:"healthy"
};
}
};

export default Orchestrator;
