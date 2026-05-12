const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require("fs");
const path = require("path");

const DB = path.join(process.cwd(), "storage/users");

function file(id){
  return path.join(DB, `${id}.json`);
}

module.exports = {

  get(id){

    try{
      const data = fs.readFileSync(file(id), "utf8");
      return JSON.parse(data);
    }catch{
      return {
        id,
        createdAt: Date.now(),
        profile: {},
        economy: {},
        activity: [],
        preferences: {}
      };
    }
  },

  save(id,data){
    fs.writeFileSync(
      file(id),
      JSON.stringify(data,null,2)
    );
    return data;
  },

  update(id,payload={}){

    const old = this.get(id);

    const next = {
      ...old,
      ...payload,
      updatedAt: Date.now()
    };

    this.save(id,next);

    return next;
  },

  pushActivity(id,event){

    const user = this.get(id);

    user.activity = user.activity || [];

    user.activity.unshift({
      event,
      at: Date.now()
    });

    user.activity = user.activity.slice(0,50);

    this.save(id,user);

    return user;
  }
};
