const afriAi = require('../core/afriAiResponder');
const runTool = require('../core/toolRunner');
const sendWhatsApp = require('../core/sendWhatsApp');

module.exports = async function agent(userId, text){

  const decision = await afriAi(userId,text);

  // CASE 1: TOOL CALL
  if(decision.type === 'tool_call'){

    const result = await runTool(decision.tool, {
      ...decision.args,
      to: userId
    });

    // optionally format tool result back to user
    await sendWhatsApp(
      userId,
      '⚙️ Tool Result:
' + JSON.stringify(result,null,2)
    );

    return 'tool_executed';
  }

  // CASE 2: NORMAL TEXT
  return decision.message;
};