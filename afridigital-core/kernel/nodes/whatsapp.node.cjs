const spine = require("../spine/redis.spine.cjs");

console.log("📲 WHATSAPP NODE ONLINE");

spine.on("INCOMING_MESSAGE", (msg) => {
  spine.emit("MESSAGE_RECEIVED", msg);
});
