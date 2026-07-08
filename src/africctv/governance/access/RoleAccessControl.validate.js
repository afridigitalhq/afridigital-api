import {
 roleAccessControl
} from "./RoleAccessControl.js";


roleAccessControl.add({
 name:"ADMIN",
 permissions:[
  "VIEW_CAMERA",
  "MANAGE_CAMERA"
 ]
});


const result =
roleAccessControl.permissions("ADMIN");


if(!result.includes("MANAGE_CAMERA")){
 throw new Error("ACCESS CONTROL FAILED");
}


console.log("👤 Role: ADMIN");
console.log("🔐 Permission:",result.join(","));
console.log("🔒 ACCESS CONTROL LOCKED");
