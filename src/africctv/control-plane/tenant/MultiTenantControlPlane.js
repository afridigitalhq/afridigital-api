export class MultiTenantControlPlane{

 access(request){

  return {
   tenant:request.tenant,
   permission:"AUTHORIZED"
  };

 }

}

export const multiTenantControlPlane =
new MultiTenantControlPlane();
