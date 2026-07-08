export class CustomerPortalBridge{

 getCustomerView(customer){

  return {
   customerId:customer.id,
   cameras:customer.cameras,
   access:"CUSTOMER_AUTHORIZED"
  };

 }

}

export const customerPortalBridge =
new CustomerPortalBridge();
