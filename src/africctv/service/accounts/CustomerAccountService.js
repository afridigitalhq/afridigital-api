const accounts=new Map();

export class CustomerAccountService{

 register(account){

  accounts.set(account.id,account);

 }

 get(id){

  return accounts.get(id);

 }

 list(){

  return [...accounts.values()];

 }

}

export const customerAccountService =
new CustomerAccountService();
