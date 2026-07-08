export class UserNotificationEngine{

 create(event){

  return {
   user:event.user,
   message:event.message,
   status:"READY"
  };

 }

}

export const userNotificationEngine =
new UserNotificationEngine();
