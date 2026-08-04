import AfriAIToolRegistry from "./AfriAIToolRegistry.js";
import AfriAIExecutionCoordinator from "../execution/coordinator/AfriAIExecutionCoordinator.js";

const skillMap = {
  payment:"payments",
  payments:"payments",
  commerce:"commerce",
  support:"support",
  automation:"automation",
  conversation:"conversation"
};

const AfriAIToolExecutor = {

execute(tool,request={}){

 const skill =
   skillMap[tool] || "conversation";

 const execution =
   AfriAIExecutionCoordinator.execute({
    skill,
    data:request
   });

 return {
   tool,
   skill,
   request,
   availableTools:AfriAIToolRegistry.load(),
   executionOwner:"AfriDigital-api",
   execution
 };

}

};

export default AfriAIToolExecutor;
