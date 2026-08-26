import AfriAIToolRegistry from "./AfriAIToolRegistry.js";
import AfriAIExecutionCoordinator from "../execution/coordinator/AfriAIExecutionCoordinator.js";

const skillMap = {
  payment:"payments",
  payments:"payments",
  commerce:"commerce",
  support:"support",
  opportunity:"opportunity",
  automation:"automation",
  education:"education",
  build_app:"build_app",
  conversation:"conversation"
};

const AfriAIToolExecutor = {

async execute(tool,request={}){

 const skill =
   skillMap[tool] || "conversation";

 const execution =
     await AfriAIExecutionCoordinator.execute({
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
