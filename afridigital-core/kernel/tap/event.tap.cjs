/**
 * 🧪 SAFE EVENT TAP (CONTRACT-ALIGNED)
 * Reads unified EventCore packet format
 */

class EventTap {

  tap(packet) {
    try {

      const event = packet?.event;
      const payload = packet?.payload || {};
      const meta = packet?.meta || {};

      const user = payload?.user || "unknown";
      const amount = payload?.amount || 0;

      console.log(
        "🧪 TAP:",
        event,
        "|",
        user,
        "|",
        amount,
        "|",
        meta.ts
      );

    } catch (e) {
      console.log("⚠️ TAP ERROR:", e.message);
    }
  }
}

module.exports = new EventTap();
