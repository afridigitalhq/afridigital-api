const customers=new Map();

export class CameraOnboarding {

 onboard(customer){

  customers.set(customer.id,{
   id:customer.id,
   cameras:customer.cameras || []
  });

  return customers.get(customer.id);
 }


 list(){
  return [...customers.values()];
 }

}


export const cameraOnboarding =
new CameraOnboarding();
