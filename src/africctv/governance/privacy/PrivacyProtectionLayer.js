export class PrivacyProtectionLayer {

 check(policy){

  return {
   policy,
   status:"PROTECTED"
  };

 }

}


export const privacyProtectionLayer =
new PrivacyProtectionLayer();
