const subs = require('../subscription/plugin.subscription.manager');
const router = require('../router/plugin.event.router');

class GlobalEventHub {

  getSnapshot() {
    return {
      subscriptions: subs.snapshot(),
      events: router.history()
    };
  }

  isReady() {
    const snap = subs.snapshot();
    return Object.keys(snap).length > 0;
  }

}

module.exports = new GlobalEventHub();
