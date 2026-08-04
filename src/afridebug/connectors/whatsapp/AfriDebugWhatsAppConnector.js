import Runtime from "../../core/runtime/AfriDebugUnifiedRuntime.js";

const AfriDebugWhatsAppConnector={
id:"AfriWhatsApp",
name:"AfriWhatsApp",
type:"messaging",
inspect(payload={}){
return Runtime.inspect({
target:"AfriWhatsApp",
operation:"inspect",
payload
});
},

health(){
return{
service:"AfriDebugWhatsAppConnector",
runtime:"AfriDebugUnifiedRuntime",
connected:true,
status:"healthy"
};
}
};

export default AfriDebugWhatsAppConnector;
