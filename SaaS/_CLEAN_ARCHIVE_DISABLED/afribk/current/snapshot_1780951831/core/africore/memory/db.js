const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "memory.json");

function load(){
  try { return JSON.parse(fs.readFileSync(FILE,"utf8")); }
  catch { return {}; }
}

function save(data){
  fs.writeFileSync(FILE, JSON.stringify(data,null,2));
}

module.exports = {

  get(userId){
    const db = load();
    return db[userId] || {
      history: [],
      lastIntent: null,
      summary: ""
    };
  },

  append(userId, entry){
    const db = load();
    const user = db[userId] || { history: [], lastIntent: null, summary: "" };

    user.history.push({
      text: entry.text,
      role: entry.role || "user",
      ts: Date.now()
    });

    user.history = user.history.slice(-30);

    db[userId] = user;
    save(db);

    return user;
  },

  setIntent(userId, intent){
    const db = load();
    const user = db[userId] || { history: [], lastIntent: null, summary: "" };

    user.lastIntent = intent;

    db[userId] = user;
    save(db);

    return user;
  },

  setSummary(userId, summary){
    const db = load();
    const user = db[userId] || { history: [], lastIntent: null, summary: "" };

    user.summary = summary;

    db[userId] = user;
    save(db);

    return user;
  }
};
