export class AdminResponseAssistant{

 analyze(device){

  return {
   device:device.id,
   observation:
   device.cause || "GENERAL_REVIEW",
   recommendation:
   "ADMIN_REVIEW_REQUIRED"
  };

 }

}

export const adminResponseAssistant =
new AdminResponseAssistant();
