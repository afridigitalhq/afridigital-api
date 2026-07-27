const AfriAIIntentRegistry = {

  intents:[
    "PROPERTY_SEARCH",
    "JOB_SEARCH",
    "SPORTS_QUERY",
    "ACCOUNT_BALANCE",
    "PAYMENT_REQUEST",
    "WITHDRAWAL_REQUEST",
    "SUBSCRIPTION_REQUEST",
    "PRODUCT_DISCOVERY",
    "SUPPORT_REQUEST"
  ],

  load(){
    return this.intents;
  }

};

export default AfriAIIntentRegistry;
