export class EcosystemAccessGovernance{

 verify(module){

  return {
   module,
   permission:"GRANTED"
  };

 }

}

export const ecosystemAccessGovernance =
new EcosystemAccessGovernance();
