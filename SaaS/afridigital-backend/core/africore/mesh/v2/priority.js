module.exports = {
  lane(event) {
    if (event.from??.includes("VIP")) return "high";
    if (event.type??.includes("bot")) return "low";
    return "normal";
  }
};
