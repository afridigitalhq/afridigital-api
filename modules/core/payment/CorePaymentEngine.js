const CorePaymentEngine={
 process(payment={}){
  return {
   id:"PAY-"+Date.now(),
   payment,
   status:"PROCESSING",
   createdAt:new Date().toISOString()
  };
 }
};

export default CorePaymentEngine;
