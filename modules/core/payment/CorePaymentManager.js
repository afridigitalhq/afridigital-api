const CorePaymentManager={
 complete(transaction){
  transaction.status="COMPLETED";
  transaction.completedAt=new Date().toISOString();
  return transaction;
 }
};

export default CorePaymentManager;
