export class CameraAccessControl {

 constructor(){
  this.permissions=new Map();
 }

 grant(user,camera){
  this.permissions.set(
   `${user}:${camera}`,
   "ALLOW"
  );
 }

 revoke(user,camera){
  this.permissions.delete(
   `${user}:${camera}`
  );
 }

 check(user,camera){
  return this.permissions.get(
   `${user}:${camera}`
  )==="ALLOW";
 }

}

export const cameraAccessControl =
new CameraAccessControl();
