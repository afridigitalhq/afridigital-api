export class ProductionReadiness {

 check(){

  return {
   auth:true,
   tenant:true,
   audit:true,
   scaling:true,
   environment:true
  };

 }

}


export const productionReadiness =
new ProductionReadiness();
