const sessions = new Map();

function getSession(userId){
  if(!sessions.has(userId)){
    sessions.set(userId,{
      history: [],
      lastActive: Date.now()
    });
  }
  return sessions.get(userId);
}

function pushMessage(userId, role, content){
  const session = getSession(userId);
  session.history.push({ role, content, ts: Date.now() });
  session.lastActive = Date.now();
}

module.exports = {
  getSession,
  pushMessage
};