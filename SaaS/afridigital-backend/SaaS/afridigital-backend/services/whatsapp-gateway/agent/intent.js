module.exports = async function detectIntent(text){
  const t = text.toLowerCase();

  if(t.startsWith('/')){
    return {type:'command', value:t};
  }

  if(t.includes('status') || t.includes('report')){
    return {type:'system_query', value:text};
  }

  return {type:'chat', value:text};
};