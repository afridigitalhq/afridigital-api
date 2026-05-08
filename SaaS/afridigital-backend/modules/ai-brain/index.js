const fs=require('fs');const path=require('path');const DB=path.join(__dirname,'storage','brain.json');

const load=()=>{try{return JSON.parse(fs.readFileSync(DB))}catch(e){return {users:{}}}};
const save=(d)=>fs.writeFileSync(DB,JSON.stringify(d,null,2));

module.exports={
init:()=>{if(!fs.existsSync(DB))save({users:{}})},
remember:(userId,msg)=>{const db=load();db.users[userId]=db.users[userId]||[];db.users[userId].push({msg,time:Date.now()});db.users[userId]=db.users[userId].slice(-100);save(db)},
recall:(userId)=>load().users[userId]||[]
};