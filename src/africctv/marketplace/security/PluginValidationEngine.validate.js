import {
 pluginValidationEngine
} from "./PluginValidationEngine.js";


const result =
pluginValidationEngine.validate({
 id:"sample-camera-plugin"
});


if(!result.approved){
 throw new Error("PLUGIN SECURITY FAILED");
}


console.log("🔌 Plugin:",result.plugin);
console.log("🛡️ Approved:",result.approved);
console.log("🔒 EXTENSION SECURITY LOCKED");
