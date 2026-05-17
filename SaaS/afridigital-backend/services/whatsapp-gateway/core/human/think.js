const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

module.exports = async function humanDelay(){
  const delay = 500 + Math.random()*1200;
  await sleep(delay);
  return true;
};
