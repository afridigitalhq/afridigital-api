const AfriAIToolRegistry = {

  tools:[
    "WalletService",
    "AfriTickService",
    "AfriVerifiedService",
    "AfriTrustService",
    "AfriCommerceService",
    "AfriWhatsAppService"
  ],

  load(){
    return this.tools;
  }

};

export default AfriAIToolRegistry;
