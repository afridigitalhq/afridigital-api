export class AfriControlPlaneConnector{

 connect(){

  return {
   system:"africctv",
   connected:true
  };

 }

}


export const afriControlPlaneConnector =
new AfriControlPlaneConnector();
