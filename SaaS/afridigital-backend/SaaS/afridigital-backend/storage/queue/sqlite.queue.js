const Database = require('better-sqlite3');
const db = new Database('queue.db');

// init table
db.exec(`
CREATE TABLE IF NOT EXISTS queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payload TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

exports.add = (payload) => {
  const stmt = db.prepare("INSERT INTO queue (payload) VALUES (?)");
  stmt.run(JSON.stringify(payload));
};

exports.fetchPending = () => {
  const stmt = db.prepare("SELECT * FROM queue WHERE status='pending' ORDER BY id ASC LIMIT 10");
  return stmt.all();
};

exports.markDone = (id) => {
  const stmt = db.prepare("UPDATE queue SET status='done' WHERE id=?");
  stmt.run(id);
};

exports.markFailed = (id) => {
  const stmt = db.prepare("UPDATE queue SET status='failed' WHERE id=?");
  stmt.run(id);
};
