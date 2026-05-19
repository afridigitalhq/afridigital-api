const fetch = require('node-fetch');

// TOOL SCHEMA (unchanged contract)
const tools = [
  {
    name: 'get_time',
    description: 'Get current server time'
  },
  {
    name: 'echo',
    description: 'Repeat user input'
  }
];

// 🔥 YOUR OWN LLM ENDPOINT
const LLM_ENDPOINT =
  process.env.AFRIAI_LLM_URL || 'https://afridigital-fmdash.onrender.com/llm';

module.exports = async function llmRouter(userText){

  const res = await fetch(LLM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: userText,
      tools
    })
  });

  const data = await res.json();

  // EXPECTED STANDARD FORMAT FROM YOUR LLM:
  // { type: 'tool_call' | 'text', tool, args, message }

  if(data.type === 'tool_call'){
    return {
      type: 'tool_call',
      tool: data.tool,
      args: data.args || {}
    };
  }

  return {
    type: 'text',
    message: data.message
  };
};