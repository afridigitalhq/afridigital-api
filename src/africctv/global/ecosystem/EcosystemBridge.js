const products=new Set();

export class EcosystemBridge {

 connect(product){

  products.add(product);

 }


 list(){

  return [...products];

 }

}


export const ecosystemBridge =
new EcosystemBridge();
