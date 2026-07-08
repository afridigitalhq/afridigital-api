export class EnterpriseDashboardBridge{

 view(tenant){

  return {
   tenant,
   access:"AUTHORIZED"
  };

 }

}

export const enterpriseDashboardBridge =
new EnterpriseDashboardBridge();
