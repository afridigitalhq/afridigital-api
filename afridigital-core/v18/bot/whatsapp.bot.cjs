const { on, channels, emit } = require("../redis/redis.spine.cjs");

on(channels.whatsapp, (msg) => {

  if (msg.text?.includes("job")) {
    emit(channels.jobs, {
      type: "AFFILIATE_TASK",
      user: msg.user,
      source: "whatsapp"
    });
  }

  if (msg.text?.includes("balance")) {
    emit(channels.events, {
      type: "BALANCE_REQUEST",
      user: msg.user
    });
  }
});
