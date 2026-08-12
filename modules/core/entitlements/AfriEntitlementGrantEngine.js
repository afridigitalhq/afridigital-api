import fs from "fs";
import path from "path";

const file="modules/core/.data/afri-entitlement-grants.json";

function load(){

 if(!fs.existsSync(file)){
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,"[]");
 }

 return JSON.parse(fs.readFileSync(file));

}


const AfriEntitlementGrantEngine={

 grant(payment={}){

  const grants=load();

  const plan=payment.plan || "free";

  const limits={
   free:{
    APP_BUILD:1
   },
   starter:{
    APP_BUILD:3
   },
   pro:{
    APP_BUILD:7
   },
   business:{
    APP_BUILD:10
   },
   enterprise:{
    APP_BUILD:15
   }
  };


  const entitlement={
   entitlementId:"entitlement_"+Date.now(),
   userId:payment.userId,
   product:payment.product,
   plan,
   grants:limits[plan] || limits.free,
   sourceTransaction:payment.transactionId || null,
   status:"GRANTED",
   createdAt:new Date().toISOString()
  };


  grants.push(entitlement);

  fs.writeFileSync(
   file,
   JSON.stringify(grants,null,2)
  );


  return entitlement;

 }

};


export default AfriEntitlementGrantEngine;
