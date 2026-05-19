const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'afri-memory.json');

function load(){
  try {
    return JSON.parse(fs.readFileSync(DB_PATH,'utf-8'));
  } catch {
    return {};
  }
}

function save(db){
  fs.writeFileSync(DB_PATH, JSON.stringify(db,null,2));
}

const db = load();

module.exports = {
  get(userId){
    if(!db[userId]){
      db[userId] = { history: [] };
    }
    return db[userId];
  },

  push(userId, role, text){
    if(!db[userId]) db[userId] = { history: [] };
    db[userId].history.push({ role, text, ts: Date.now() });
    save(db);
  }
};
