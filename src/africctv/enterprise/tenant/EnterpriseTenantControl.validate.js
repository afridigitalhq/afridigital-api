import {
 enterpriseTenantControl
} from "./EnterpriseTenantControl.js";


const tenant =
enterpriseTenantControl.create(
 "enterprise01"
);


if(tenant.isolation!=="ENABLED"){
 throw new Error("TENANT CONTROL FAILED");
}


console.log("🏢 Tenant:",tenant.id);
console.log("🔐 Isolation:",tenant.isolation);
console.log("🔒 ENTERPRISE TENANT CONTROL LOCKED");
