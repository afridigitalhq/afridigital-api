const AfriPayPaymentOrchestrator={
  createRequest({userId="",tenantId="",amount=0,currency="AfriCoin",method="",purpose="",metadata={}}={}){
    return {status:"PAYMENT_REQUEST_READY",userId,tenantId,amount,currency,method,purpose,metadata,createdAt:new Date().toISOString()};
  }
};
export default AfriPayPaymentOrchestrator;
