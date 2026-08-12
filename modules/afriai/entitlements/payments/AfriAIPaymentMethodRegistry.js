const AfriAIPaymentMethodRegistry={
  methods:[
    {id:"CARD",status:"AVAILABLE",provider:"PAYMENT_GATEWAY"},
    {id:"BANK_TRANSFER",status:"AVAILABLE",provider:"PAYMENT_GATEWAY"},
    {id:"USSD",status:"AVAILABLE",provider:"PAYMENT_GATEWAY"},
    {id:"CRYPTO",status:"CONFIGURABLE",provider:"CRYPTO_GATEWAY"}
  ],
  list(){return this.methods;},
  get(id){return this.methods.find(method=>method.id===id)||null;}
};
export default AfriAIPaymentMethodRegistry;
