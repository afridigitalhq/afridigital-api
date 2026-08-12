import fs from "fs";
import path from "path";

const file="modules/core/.data/afri-billing-transactions.json";

function load(){

 if(!fs.existsSync(file)){
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,"[]");
 }

 return JSON.parse(fs.readFileSync(file));

}


const AfriBillingTransactionEngine={

 record(transaction={}){

  const data=load();

  const record={
   transactionId:"txn_"+Date.now(),
   userId:transaction.userId || null,
   product:transaction.product || null,
   feature:transaction.feature || null,
   plan:transaction.plan || null,
   paymentType:transaction.paymentType || "PAYG",
   currency:transaction.currency || "USD",
   amount:transaction.amount || 0,
   status:"PAYMENT_RECORDED",
   createdAt:new Date().toISOString()
  };


  data.push(record);

  fs.writeFileSync(
   file,
   JSON.stringify(data,null,2)
  );


  return record;

 },


 list(){
  return load();
 }

};


export default AfriBillingTransactionEngine;
