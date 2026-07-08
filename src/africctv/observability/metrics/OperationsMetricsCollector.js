const metrics=[];

export class OperationsMetricsCollector{

 record(metric){

  metrics.push({
   ...metric,
   timestamp:Date.now()
  });

 }

 report(){

  return metrics;

 }

}


export const operationsMetricsCollector =
new OperationsMetricsCollector();
