import {
 multiTenantControlPlane
} from "./MultiTenantControlPlane.js";


const result =
multiTenantControlPlane.access({
 tenant:"enterprise001"
});


if(result.permission!=="AUTHORIZED"){
 throw new Error("TENANT CONTROL FAILED");
}


console.log("🏢 Tenant:",result.tenant);
console.log("🔐 Permission:",result.permission);
console.log("🔒 MULTI TENANT CONTROL LOCKED");
