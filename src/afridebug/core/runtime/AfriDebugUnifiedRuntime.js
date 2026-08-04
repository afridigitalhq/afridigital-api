import Dispatcher from "./AfriDebugConnectorDispatcher.js";
import Pipeline from "./AfriDebugExecutionPipeline.js";

const AfriDebugUnifiedRuntime={
inspect(request={}){
const dispatch=Dispatcher.dispatch(request);
if(!dispatch.accepted)return dispatch;
const execution=Pipeline.execute(request);
return{
runtime:"AfriDebugUnifiedRuntime",
dispatch,
execution,
completedAt:Date.now(),
completedAtISO:new Date().toISOString()
};
},
health(){
return{
service:"AfriDebugUnifiedRuntime",
version:"49.4",
dispatcher:Dispatcher.health(),
pipeline:Pipeline.health(),
status:"healthy"
};
}
};
export default AfriDebugUnifiedRuntime;
