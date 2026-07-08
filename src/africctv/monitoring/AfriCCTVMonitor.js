export class AfriCCTVMonitor {

 metrics(){

  return {
   cameras:1,
   streams:1,
   status:"HEALTHY"
  };

 }

}


export const afriCCTVMonitor =
new AfriCCTVMonitor();
