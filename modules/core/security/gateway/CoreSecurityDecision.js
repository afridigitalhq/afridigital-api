const CoreSecurityDecision={approve(target){return {target,status:"SECURITY_APPROVED"};},reject(target){return {target,status:"SECURITY_REJECTED"};}};
export default CoreSecurityDecision;
