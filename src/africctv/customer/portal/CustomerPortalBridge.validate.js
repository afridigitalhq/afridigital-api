import {
 customerPortalBridge
} from "./CustomerPortalBridge.js";


const result =
customerPortalBridge.getCustomerView({
 id:"user001",
 cameras:5
});


if(result.access!=="CUSTOMER_AUTHORIZED"){
 throw new Error("CUSTOMER PORTAL FAILED");
}


console.log("👤 Customer:",result.customerId);
console.log("🎥 Cameras:",result.cameras);
console.log("🔒 CUSTOMER PORTAL BRIDGE LOCKED");
