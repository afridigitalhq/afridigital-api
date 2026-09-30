import AfriAIAgentRegistry from "../registry/AfriAIAgentRegistry.js";
import AfriAITaskPlanner from "../planner/AfriAITaskPlanner.js";
import AfriAITaskExecutor from "../executor/AfriAITaskExecutor.js";
const AfriAIAgentRuntime={
async run(task={}){
const plan=AfriAITaskPlanner.plan(task);
const result=await AfriAITaskExecutor.execute(plan);
return{agents:AfriAIAgentRegistry.load(),plan,result,status:"READY"};
}};
export default AfriAIAgentRuntime;
