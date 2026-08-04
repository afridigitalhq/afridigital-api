const Decision={

evaluate(input){

const checks={
 identity:input.identity===true,
 certificate:input.certificate===true,
 revoked:input.revoked===false,
 zeroTrust:input.zeroTrust==="allow",
 policy:input.policy===true,
 keyActive:input.keyActive===true,
 hsm:input.hsm===true
};

const allowed=Object.values(checks).every(Boolean);

return{
 decision:allowed?"ALLOW":"DENY",
 checks,
 evaluatedAt:Date.now(),
 evaluatedAtISO:new Date().toISOString()
};

},

health(){

return{
 service:"AfriDebugFinalSecurityDecisionEngine",
 status:"healthy"
};

}

};

export default Decision;
