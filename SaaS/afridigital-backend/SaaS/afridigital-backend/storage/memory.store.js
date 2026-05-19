const db = {};

exports.append = (userId, data) => {
  if (!db[userId]) db[userId] = { history: [] };
  db[userId].history.push(data);
};

exports.get = (userId) => {
  if (!db[userId]) db[userId] = { history: [] };
  return db[userId];
};
