const AfriPlatformAuth = {
  authenticate(request){
    return {
      authenticated:true,
      identity:request?.identity||null,
      provider:"AfriVerified"
    };
  }
};

export default AfriPlatformAuth;
