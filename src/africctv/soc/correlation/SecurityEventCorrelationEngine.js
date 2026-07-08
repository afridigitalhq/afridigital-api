const events=[];

export class SecurityEventCorrelationEngine{

 ingest(event){

  events.push(event);

 }

 list(){

  return events;

 }

}

export const securityEventCorrelationEngine =
new SecurityEventCorrelationEngine();
