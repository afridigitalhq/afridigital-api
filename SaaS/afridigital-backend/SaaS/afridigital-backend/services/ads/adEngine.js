const { assertApiVersion } = require("../runtime/safety/api.guard");
const crypto = require('crypto');

class AdEngine {

  constructor() {
    this.ads = new Map();
  }

  createAd(data) {

    const id = crypto.randomUUID();

    this.ads.set(id, {
      id,
      ...data,
      impressions: 0,
      clicks: 0,
      status: "active",
      createdAt: Date.now()
    });

    return this.ads.get(id);
  }

}

module.exports = new AdEngine();
