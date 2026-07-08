const identities=new Map();

export class IdentityAccessManager {

 register(user){

  identities.set(user.id,{
   ...user,
   status:"ACTIVE"
  });

  return identities.get(user.id);
 }


 authorize(id,role){

  const user=identities.get(id);

  return !!user && user.role===role;

 }


 list(){

  return [...identities.values()];

 }

}


export const identityAccessManager =
new IdentityAccessManager();
