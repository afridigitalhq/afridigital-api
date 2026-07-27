const AfriTickService = {
  getMembership(userId){
    return {
      userId,
      tier:"BASIC",
      subscriptionStatus:"INACTIVE",
      benefits:[],
      expiresAt:null
    };
  }
};

export default AfriTickService;
