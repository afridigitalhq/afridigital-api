import Bootstrap from "./AfriDebugConnectorBootstrap.js";
import Runtime from "./AfriDebugUnifiedRuntime.js";

const TARGETS=[
"AfriWhatsApp",
"AfriCommerce",
"AfriWeb",
"AfriDesignStudio"
];

const AfriDebugConnectorCertificationRuntime={
certify(){
Bootstrap.boot();

const results=TARGETS.map(target=>{
const result=Runtime.inspect({
target,
operation:"inspect"
});

return{
target,
passed:result.dispatch?.accepted===true&&result.execution?.status==="executed",
dispatch:result.dispatch?.status,
execution:result.execution?.status
};
});

return{
total:results.length,
passed:results.filter(r=>r.passed).length,
failed:results.filter(r=>!r.passed).length,
results,
certifiedAt:Date.now(),
certifiedAtISO:new Date().toISOString()
};
},

health(){
return{
service:"AfriDebugConnectorCertificationRuntime",
status:"healthy"
};
}
};

export default AfriDebugConnectorCertificationRuntime;
