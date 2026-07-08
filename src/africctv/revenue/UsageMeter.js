export class UsageMeter {

 constructor(){
  this.events=0;
 }

 record(){
  this.events++;
 }

 report(){

  return {
   usage:this.events,
   status:"TRACKING"
  };

 }

}


export const usageMeter =
new UsageMeter();
