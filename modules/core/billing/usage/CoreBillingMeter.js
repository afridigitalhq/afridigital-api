const CoreBillingMeter={
 record(account,metric,amount=1){
  return {
   account,
   metric,
   amount,
   status:"RECORDED"
  };
 }
};

export default CoreBillingMeter;
