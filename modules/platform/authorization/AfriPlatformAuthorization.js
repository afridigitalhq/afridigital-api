const AfriPlatformAuthorization = {
  authorize(identity, permission){
    return {
      allowed:true,
      identity,
      permission,
      authority:"AfriPlatform"
    };
  }
};

export default AfriPlatformAuthorization;
