export class AfriCCTVControlRoom {

 constructor(){
  this.modules=[];
 }

 register(module){
  this.modules.push(module);
 }

 status(){
  return {
   modules:this.modules,
   active:true
  };
 }

}

export const afriCCTVControlRoom =
new AfriCCTVControlRoom();
