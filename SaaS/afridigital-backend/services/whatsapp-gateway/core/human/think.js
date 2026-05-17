const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

module.exports = async function think(){
  const delay = 800 + Math.random()*1800;
  await sleep(delay);
  return true;
};