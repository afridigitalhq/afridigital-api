const patterns=new Map();

export class CameraBehaviorLearning {

 learn(camera,event){

  patterns.set(camera,{
   lastEvent:event,
   trained:true
  });

  return patterns.get(camera);
 }


 profile(camera){

  return patterns.get(camera) || null;

 }

}


export const cameraBehaviorLearning =
new CameraBehaviorLearning();
