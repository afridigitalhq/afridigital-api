import fs from "fs";

const file="modules/core/.data/afri-payg-credits.json";

function load(){
 if(!fs.existsSync(file)){
  fs.writeFileSync(file,"[]");
 }
 return JSON.parse(fs.readFileSync(file));
}

function save(data){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
}

const AfriPayGCreditRegistry={

 grant(data={}){

  const credits=load();

  let account=credits.find(
   x=>x.userId===data.userId &&
      x.product===data.product &&
      x.feature===data.feature
  );

  if(!account){

   account={
    creditId:"credit_"+Date.now(),
    userId:data.userId,
    product:data.product,
    feature:data.feature,
    balance:0,
    createdAt:new Date().toISOString()
   };

   credits.push(account);
  }

  account.balance += data.quantity || 1;
  account.updatedAt=new Date().toISOString();

  save(credits);

  return account;
 },


 consume(data={}){

  const credits=load();

  const account=credits.find(
   x=>x.userId===data.userId &&
      x.product===data.product &&
      x.feature===data.feature
  );

  if(!account || account.balance < data.quantity){
   return {
    status:"INSUFFICIENT_CREDIT"
   };
  }

  account.balance -= data.quantity;
  account.updatedAt=new Date().toISOString();

  save(credits);

  return account;
 },


 resolve(userId,product,feature){

  return load().find(
   x=>x.userId===userId &&
      x.product===product &&
      x.feature===feature
  ) || null;

 }

};

export default AfriPayGCreditRegistry;
