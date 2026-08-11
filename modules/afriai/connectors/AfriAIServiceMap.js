const AfriAIServiceMap = {

  mappings:{
    PROPERTY_SEARCH:"PropertyService",
    JOB_SEARCH:"AfriWork",
    SPORTS_QUERY:"AfriSportsService",
    ACCOUNT_BALANCE:"WalletService",
    PAYMENT_REQUEST:"PaymentService",
    WITHDRAWAL_REQUEST:"WithdrawalService",
    SUBSCRIPTION_REQUEST:"AfriTickService",
    IDENTITY_CHECK:"AfriVerifiedService",
    TRUST_PROFILE:"AfriTrustService"
  },

  resolve(intent){
    return this.mappings[intent] || null;
  }

};

export default AfriAIServiceMap;
