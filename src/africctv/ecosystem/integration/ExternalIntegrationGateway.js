export class ExternalIntegrationGateway{

 connect(request){

  return {
   target:request.target,
   status:"APPROVED"
  };

 }

}

export const externalIntegrationGateway =
new ExternalIntegrationGateway();
