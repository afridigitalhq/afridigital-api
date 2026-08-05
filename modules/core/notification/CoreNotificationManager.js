const CoreNotificationManager={
 send(notification){
  notification.status="SENT";
  notification.sentAt=new Date().toISOString();
  return notification;
 }
};

export default CoreNotificationManager;
