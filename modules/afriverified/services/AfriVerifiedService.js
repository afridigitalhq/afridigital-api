const AfriVerifiedService = {
  getVerificationStatus(userId){
    return {
      userId,
      verified:false,
      verificationLevel:null,
      updatedAt:null
    };
  }
};

export default AfriVerifiedService;
