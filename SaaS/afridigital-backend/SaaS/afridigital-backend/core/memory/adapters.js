/**
 * AfriAI Production Memory Architecture Layer
 * RAM + Redis + MongoDB (safe-ready mode)
 */

const memoryAdapters = {
  redis: global.__REDIS_CLIENT__ || null,
  mongo: global.__MONGO_CLIENT__ || null,

  async saveToRedis(key, value) {
    if (!this.redis) {
      console.log("⚡ Redis OFFLINE (safe mode)");
      return { ok: false, reason: "redis_not_connected" };
    }

    try {
      await this.redis.set(key, JSON.stringify(value));
      console.log("⚡ Redis SAVE OK:", key);
      return { ok: true };
    } catch (e) {
      console.log("⚠️ Redis ERROR:", e.message);
      return { ok: false, error: e.message };
    }
  },

  async saveToMongo(collection, data) {
    if (!this.mongo) {
      console.log("🗄 Mongo OFFLINE (safe mode)");
      return { ok: false, reason: "mongo_not_connected" };
    }

    try {
      await this.mongo.collection(collection).insertOne(data);
      console.log("🗄 Mongo SAVE OK:", collection);
      return { ok: true };
    } catch (e) {
      console.log("⚠️ Mongo ERROR:", e.message);
      return { ok: false, error: e.message };
    }
  }
};

module.exports = memoryAdapters;
