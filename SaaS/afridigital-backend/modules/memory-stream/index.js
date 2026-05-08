const fs=require('fs');
const path=require('path');

const LOG=path.join(__dirname,'../../storage/memory-snapshots/stream.log');

function write(event){
fs.appendFileSync(LOG,JSON.stringify({time:Date.now(),event})+'
');
}

function read(){
try{
return fs.readFileSync(LOG,'utf-8').trim().split('
').slice(-50).map(JSON.parse);
}catch(e){return [];}
}

module.exports={write,read};