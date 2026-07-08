const notifications=[];

export class AdminNotificationCenter{

 notify(message){

  notifications.push({
   message,
   read:false
  });

 }

 inbox(){

  return notifications;

 }

}


export const adminNotificationCenter =
new AdminNotificationCenter();
