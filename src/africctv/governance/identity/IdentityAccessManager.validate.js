import {
 identityAccessManager
} from "./IdentityAccessManager.js";


identityAccessManager.register({
 id:"operator01",
 role:"ADMIN"
});


const access =
identityAccessManager.authorize(
 "operator01",
 "ADMIN"
);


if(!access){
 throw new Error("IDENTITY ACCESS FAILED");
}


console.log("👤 Identity: operator01");
console.log("🔐 Access:",access);
console.log("🔒 IDENTITY GOVERNANCE LOCKED");
