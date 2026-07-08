export class AdminOperationsDataProvider{

 snapshot(){

  return {
   status:"LIVE",
   cameras:3,
   alerts:0
  };

 }

}


export const adminOperationsDataProvider =
new AdminOperationsDataProvider();
