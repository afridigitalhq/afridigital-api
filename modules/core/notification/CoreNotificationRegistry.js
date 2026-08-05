const CoreNotificationRegistry={
 register(channel,adapter){
  return {channel,adapter,status:"REGISTERED"};
 }
};

export default CoreNotificationRegistry;
