import {
 cctvSubscription
} from "./CCTVSubscription.js";


cctvSubscription.attach(
 "customer01",
 "ENTERPRISE"
);


const result =
cctvSubscription.get("customer01");


if(result.status!=="ACTIVE"){
 throw new Error("BILLING BINDING FAILED");
}


console.log("👤 Customer:",result.customer);
console.log("💳 Plan:",result.plan);
console.log("🔒 SUBSCRIPTION BILLING LOCKED");
