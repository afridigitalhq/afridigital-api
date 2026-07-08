import {
 adminResolutionWorkflow
} from "./AdminResolutionWorkflow.js";


adminResolutionWorkflow.resolve({
 camera:"cam01",
 action:"CONTACT_USER"
});


const result =
adminResolutionWorkflow.list();


if(
result[0].status!=="RESOLVED_BY_ADMIN"
){
 throw new Error("WORKFLOW FAILED");
}


console.log("🎥 Camera:",result[0].camera);
console.log("🔧 Action:",result[0].action);
console.log("👤 Status:",result[0].status);
console.log("🔒 ADMIN WORKFLOW LOCKED");
