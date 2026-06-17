const fs = require("fs");

const path = "logs/memory/store.json";

function load(){
  try { return JSON.parse(fs.readFileSync(path,"utf8") || "{}"); }
  catch { return {}; }
}

function save(data){
  try { fs.writeFileSync(path, JSON.stringify(data,null,2)); } catch {}
}

function remember(user, key, value){
  const db = load();
  db[user] = db[user] || {};
  db[user][key] = value;
  save(db);
}

function recall(user){
  const db = load();
  return db[user] || {};
}

module.exports = { remember, recall };
