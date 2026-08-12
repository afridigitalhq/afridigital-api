import fs from "fs";
import path from "path";

const file="modules/core/.data/afri-pricing.json";

function load(){

 if(!fs.existsSync(file)){

  fs.mkdirSync(path.dirname(file),{recursive:true});

  fs.writeFileSync(file,JSON.stringify([
   {
    feature:"APK_EXPORT",
    price:2,
    currency:"USD",
    afriCoinEquivalent:null,
    status:"ACTIVE"
   },
   {
    feature:"VERSION_UPGRADE",
    price:2,
    currency:"USD",
    afriCoinEquivalent:null,
    status:"ACTIVE"
   }
  ],null,2));

 }

 return JSON.parse(fs.readFileSync(file));

}


const AfriPricingRegistry={

 list(){

  return load();

 },


 resolve(feature){

  return load().find(
   item=>item.feature===feature
  ) || null;

 },


 update(item){

  const prices=load();

  const index=prices.findIndex(
   p=>p.feature===item.feature
  );

  if(index>=0){
   prices[index]={
    ...prices[index],
    ...item
   };
  }else{
   prices.push(item);
  }

  fs.writeFileSync(
   file,
   JSON.stringify(prices,null,2)
  );

  return {
   feature:item.feature,
   status:"PRICE_UPDATED",
   createdAt:new Date().toISOString()
  };

 }

};


export default AfriPricingRegistry;
