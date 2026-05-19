const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

module.exports = async function typingSimulation(){
  // simulate human thinking
  const delay = 800 + Math.random()*1500;
  await sleep(delay);
  return true;
};