const executions = new Map();

const AfriAIExecutionRegistry = {

 register(type,handler){

   executions.set(type,handler);

   return {
     type,
     registered:true
   };

 },

 resolve(type){

   return executions.get(type) || null;

 },

 list(){

   return Array.from(executions.keys());

 }

};

export default AfriAIExecutionRegistry;
