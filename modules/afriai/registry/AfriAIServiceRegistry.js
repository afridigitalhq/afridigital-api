const AfriAIServiceRegistry = {

  services:[
    "AfriVerified",
    "AfriTrust",
    "AfriTick",
    "AfriWhatsApp",
    "AfriCommerce",
    "AfriAds",
    "Wallet"
  ],

  load(){
    return this.services;
  }

};

export default AfriAIServiceRegistry;
