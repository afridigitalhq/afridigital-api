export class CommunicationGateway{

 route(channel,message){

  return {
   channel,
   message,
   status:"QUEUED"
  };

 }

}


export const communicationGateway =
new CommunicationGateway();
