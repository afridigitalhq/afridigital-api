export class AfriAIContextLayer{

 load(context){

  return {
   source:"AFRICCTV",
   context
  };

 }

}

export const afriAIContextLayer =
new AfriAIContextLayer();
