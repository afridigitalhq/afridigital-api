import {
 customerAccountService
} from "./CustomerAccountService.js";


customerAccountService.register({
 id:"user001",
 cameras:5,
 service:"ACTIVE"
});


const result =
customerAccountService.get("user001");


if(result.service!=="ACTIVE"){
 throw new Error("ACCOUNT SERVICE FAILED");
}


console.log("👤 User:",result.id);
console.log("🎥 Cameras:",result.cameras);
console.log("📡 Service:",result.service);
console.log("🔒 CUSTOMER ACCOUNT SERVICE LOCKED");
