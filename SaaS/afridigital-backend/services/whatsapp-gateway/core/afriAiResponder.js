module.exports = async function afriAiResponder(userId,text){
  // fallback brain (no API dependency yet)
  if(!text) return {type:'text',message:'Send a message'};

  if(text.toLowerCase().includes('time')){
    return {type:'text',message:'⏱ Server is alive. Time layer coming next.'};
  }

  return {
    type:'text',
    message:'🤖 AfriAI received: ' + text
  };
};