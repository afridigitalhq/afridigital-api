const fs = require('fs');
const contract = require('./contract');

const RULES = [
  'console.log',
  '┌','└','│','━',
  'AFRISCAN',
  'SYSTEM DEGRADED',
  '🧠'
];

function scan(file){
  try {
    const c = fs.readFileSync(file,'utf8');
    const hits = RULES.filter(r => c.includes(r));
    return hits.length ? { file, hits } : null;
  } catch {
    return null;
  }
}

function scanGroup(list){
  return list.map(scan).filter(Boolean);
}

module.exports = function evaluate(){
  const coreV = scanGroup(contract.core);
  const engineV = scanGroup(contract.engine);

  const ok = coreV.length === 0 && engineV.length === 0;

  const score =
    ok ? 100 :
    coreV.length === 0 ? 80 :
    50;

  return {
    score,
    state: score === 100 ? "HEALTHY" : score >= 80 ? "STABLE" : "DEGRADED",
    violations: {
      core: coreV,
      engine: engineV
    }
  };
};
