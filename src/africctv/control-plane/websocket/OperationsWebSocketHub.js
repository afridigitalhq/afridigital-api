const clients=[];

export class OperationsWebSocketHub{

 connect(client){

  clients.push(client);

 }

 broadcast(event){

  return {
   event,
   delivered:clients.length
  };

 }

}

export const operationsWebSocketHub =
new OperationsWebSocketHub();
