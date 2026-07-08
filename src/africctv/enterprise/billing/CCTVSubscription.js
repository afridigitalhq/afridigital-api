const plans=new Map();

export class CCTVSubscription {

 attach(customer,plan){

  plans.set(customer,{
   customer,
   plan,
   status:"ACTIVE"
  });

  return plans.get(customer);
 }


 get(customer){
  return plans.get(customer);
 }

}


export const cctvSubscription =
new CCTVSubscription();
