export class PrivacyManagement{

 verify(){

  return {
   encryption:"ENABLED",
   accessTracking:"ENABLED"
  };

 }

}


export const privacyManagement =
new PrivacyManagement();
