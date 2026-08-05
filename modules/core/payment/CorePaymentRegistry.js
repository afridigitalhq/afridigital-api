const CorePaymentRegistry={
 register(provider,adapter){
  return {
   provider,
   adapter,
   status:"REGISTERED"
  };
 }
};

export default CorePaymentRegistry;
