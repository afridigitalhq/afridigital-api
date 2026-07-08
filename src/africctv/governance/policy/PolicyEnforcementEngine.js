const policies=new Map();

export class PolicyEnforcementEngine{

 register(policy){

  policies.set(policy.id,policy);

 }

 check(id){

  return policies.get(id);

 }

}


export const policyEnforcementEngine =
new PolicyEnforcementEngine();
