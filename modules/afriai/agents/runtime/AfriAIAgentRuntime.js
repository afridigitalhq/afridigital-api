import AfriAIAgentRegistry from "../registry/AfriAIAgentRegistry.js";
import AfriAITaskPlanner from "../planner/AfriAITaskPlanner.js";
import AfriAITaskExecutor from "../executor/AfriAITaskExecutor.js";
const AfriAIAgentRuntime={
run(task={}){
const plan=AfriAITaskPlanner.plan(task);
const result=AfriAITaskExecutor.execute(plan);
return{agents:AfriAIAgentRegistry.load(),plan,result,status:"READY"};
}};
export default AfriAIAgentRuntime;
