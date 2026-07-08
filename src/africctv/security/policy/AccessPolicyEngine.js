export class AccessPolicyEngine{

 check(role,action){

  return {
   role,
   action,
   allowed:true
  };

 }

}

export const accessPolicyEngine =
new AccessPolicyEngine();
