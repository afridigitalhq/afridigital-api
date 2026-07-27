const AfriPlatformNotifications = {
  publish(notification){
    return {
      notification,
      status:"QUEUED"
    };
  }
};

export default AfriPlatformNotifications;
