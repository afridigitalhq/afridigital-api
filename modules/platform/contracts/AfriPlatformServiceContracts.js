const AfriPlatformServiceContracts = {
  AfriVerified:{
    endpoints:["verifyIdentity","getVerificationStatus"]
  },
  AfriTrust:{
    endpoints:["getTrustProfile","getPublicCard","getTrustInsights"]
  },
  AfriTick:{
    endpoints:["getMembership","subscribe","renew","cancel"]
  },
  AfriAI:{
    endpoints:["chat","assist","summarize"]
  },
  AfriAds:{
    endpoints:["getAds","trackImpression"]
  },
  AfriCoin:{
    endpoints:["wallet","transfer","balance"]
  },
  AfriWallet:{
    endpoints:["deposit","withdraw","transactions"]
  },
  Notifications:{
    endpoints:["send","history"]
  },
  Analytics:{
    endpoints:["recordEvent","dashboard"]
  }
};

export default AfriPlatformServiceContracts;
