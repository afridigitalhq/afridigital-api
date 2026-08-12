import fs from "fs";
import path from "path";

const file="modules/core/.data/afri-payment-receipts.json";

function load(){

 if(!fs.existsSync(file)){
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,"[]");
 }

 return JSON.parse(fs.readFileSync(file));

}


const AfriPaymentReceiptEngine={

 generate(payment={}){

  const receipts=load();

  const receipt={
   receiptId:"receipt_"+Date.now(),
   transactionId:payment.transactionId || null,
   userId:payment.userId || null,
   product:payment.product || null,
   feature:payment.feature || null,
   amount:payment.amount || 0,
   currency:payment.currency || "USD",
   status:"RECEIPT_GENERATED",
   createdAt:new Date().toISOString()
  };


  receipts.push(receipt);

  fs.writeFileSync(
   file,
   JSON.stringify(receipts,null,2)
  );


  return receipt;

 },


 list(){

  return load();

 }

};


export default AfriPaymentReceiptEngine;
