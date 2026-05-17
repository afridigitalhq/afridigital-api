const tools = require('./tools');

module.exports = async function runTool(toolName, args){
  const tool = tools[toolName];

  if(!tool){
    return {error:'UNKNOWN_TOOL', tool: toolName};
  }

  try{
    const result = await tool(args || {});
    return {ok:true, result};
  }catch(err){
    return {ok:false, error:err.message};
  }
};