module.exports = function simulateTyping(ms=1200){
  return new Promise(resolve => setTimeout(resolve, ms));
};