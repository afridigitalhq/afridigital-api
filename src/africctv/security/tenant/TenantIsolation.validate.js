import {
 tenantIsolation
} from "./TenantIsolation.js";


tenantIsolation.registerTenant({
 id:"tenant01"
});


tenantIsolation.attachCamera(
 "tenant01",
 "cam01"
);


const allowed =
tenantIsolation.canAccess(
 "tenant01",
 "cam01"
);


if(!allowed){
 throw new Error("TENANT ISOLATION FAILED");
}


console.log("🏢 Tenant: tenant01");
console.log("🎥 Camera: cam01");
console.log("🔐 Access:",allowed);
console.log("🔒 TENANT ISOLATION LOCKED");
