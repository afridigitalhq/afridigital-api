const { assertApiVersion } = require("../runtime/safety/api.guard");
const sessions = new Map();

module.exports = {

  get(id){

    if(!sessions.has(id)){
      sessions.set(id,{
        id,
        createdAt: Date.now(),
        context: [],
        lastSeen: Date.now(),
        mode: "chat"
      });
    }

    return sessions.get(id);
  },

  update(id,data={}){

    const current = this.get(id);

    const next = {
      ...current,
      ...data,
      lastSeen: Date.now()
    };

    sessions.set(id,next);

    return next;
  },

  push(id,event){

    const current = this.get(id);

    current.context.unshift({
      ...event,
      at: Date.now()
    });

    current.context =
      current.context.slice(0,20);

    sessions.set(id,current);

    return current;
  }
};
