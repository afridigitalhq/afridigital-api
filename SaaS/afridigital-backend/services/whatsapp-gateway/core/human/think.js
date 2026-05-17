const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

module.exports = async function humanDelay(){
  const thinkTime = 800 + Math.random()*2000;
  await sleep(thinkTime);
  return true;
};
