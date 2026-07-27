const AfriTrustService = {
  getPublicTrustProfile(userId){
    return {
      userId,
      platformTrust:null,
      productTrusts:[],
      badges:[],
      statistics:{},
      ratings:{}
    };
  }
};

export default AfriTrustService;
