const memory = new Map();

module.exports = {
  get(userId){
    if(!memory.has(userId)){
      memory.set(userId,{
        history: [],
        created: Date.now()
      });
    }
    return memory.get(userId);
  },

  push(userId, role, text){
    const s = this.get(userId);
    s.history.push({ role, text, ts:Date.now() });
  }
};