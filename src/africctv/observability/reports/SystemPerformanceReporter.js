export class SystemPerformanceReporter{

 generate(){

  return {
   uptime:"99.9%",
   performance:"STABLE",
   cameras:"OPERATIONAL"
  };

 }

}


export const systemPerformanceReporter =
new SystemPerformanceReporter();
