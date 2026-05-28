module.exports = function(){
  console.log("🧱 afriAI hook disabled (kernel safe mode)");
  return {
    setReply: () => {},
    reply: null
  };
};
