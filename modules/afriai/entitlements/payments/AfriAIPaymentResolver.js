const AfriAIPaymentResolver={
  resolve({method="",amount=0,currency="AFRICO",context={}}={}){
    return {
      method,
      amount,
      currency,
      status:"PAYMENT_ROUTE_PENDING",
      requiresProviderConfirmation:true,
      walletCreditRequiresVerification:true,
      context
    };
  }
};
export default AfriAIPaymentResolver;
