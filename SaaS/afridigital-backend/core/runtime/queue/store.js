const fs = require('fs');
const path = require('path');
const STORE = path.join(__dirname, 'queue.store.json');
function init(){ if(!fs.existsSync(STORE)) fs.writeFileSync(STORE,'[]'); }
function read(){ try{return JSON.parse(fs.readFileSync(STORE,'utf8'));}catch{return [];} }
function write(d){ fs.writeFileSync(STORE,JSON.stringify(d,null,2)); }
module.exports={STORE,init,read,write};
