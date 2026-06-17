const fs = require('fs');

const file = './core/ai/brain.js';
let c = fs.readFileSync(file,'utf8');

if (!c.includes('module.exports.think')) {
  c += `

module.exports.think = runBrain;
module.exports.runBrain = runBrain;
`;
}

fs.writeFileSync(file, c);
console.log('✔ brain compatibility layer added');
