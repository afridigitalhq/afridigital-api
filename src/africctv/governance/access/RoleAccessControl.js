const roles=new Map();

export class RoleAccessControl{

 add(role){

  roles.set(role.name,role.permissions);

 }

 permissions(name){

  return roles.get(name);

 }

}


export const roleAccessControl =
new RoleAccessControl();
