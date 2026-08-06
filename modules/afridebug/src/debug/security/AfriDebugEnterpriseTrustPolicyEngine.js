const Policy={

evaluate(context){

const rules={
 trustedSigner:context.trustedSigner===true,
 approved:context.approved===true,
 environmentAllowed:["development","staging","production"].includes(context.environment),
 riskAllowed:context.risk!=="critical" || context.approved===true
};

const allowed=Object.values(rules).every(Boolean);

return{
 policy:"Enterprise Security Policy v1",
 allowed,
 rules,
 evaluatedAt:Date.now(),
 evaluatedAtISO:new Date().toISOString()
};

},

health(){

return{
 service:"AfriDebugEnterpriseTrustPolicyEngine",
 status:"healthy"
};

}

};

export default Policy;
