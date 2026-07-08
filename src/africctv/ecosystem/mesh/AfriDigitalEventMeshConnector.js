const events=[];

export class AfriDigitalEventMeshConnector{

 publish(event){

  events.push(event);

 }

 list(){

  return events;

 }

}

export const afriDigitalEventMeshConnector =
new AfriDigitalEventMeshConnector();
