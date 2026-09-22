import AfriForexDemoStore from "../../../modules/afriforex/storage/AfriForexDemoStore.js";
import AfriPlatformEventBus from "../../../modules/platform/events/bus/AfriPlatformEventBus.js";

export default function afriForexWhatsAppE2ERoute(app) {
  app.post("/api/afriforex/whatsapp-e2e-test", async (req, res) => {
    try {
      const customerId = "notification-test";
      const phone = String(process.env.META_TEST_RECIPIENT || "").trim();

      if (!phone) {
        return res.status(503).json({
          ok: false,
          certification: "AFRIFOREX_WHATSAPP_NOTIFICATION_E2E",
          error: "META_TEST_RECIPIENT_NOT_CONFIGURED"
        });
      }

      const current = AfriForexDemoStore.getPreferences(customerId);

      AfriForexDemoStore.savePreferences({
        ...current,
        customerId,
        notificationPreferences: {
          ...current.notificationPreferences,
          enabled: true,
          destinations: {
            ...current.notificationPreferences.destinations,
            afriWhatsApp: {
              phone,
              status: "REGISTERED"
            }
          },
          channels: {
            ...current.notificationPreferences.channels,
            afriWhatsApp: true
          }
        }
      });

      AfriPlatformEventBus.publish("TRADE_ALERT", {
        customerId,
        source: "AFRIFOREX_WHATSAPP_E2E",
        market: "BTC/USDT",
        direction: "BUY",
        momentumStrengthPercent: 85,
        changes: {
          directionChanged: {
            from: "SELL",
            to: "BUY"
          }
        }
      });

      res.json({
        ok: true,
        certification: "AFRIFOREX_WHATSAPP_NOTIFICATION_E2E",
        customerId,
        recipient: "META_TEST_RECIPIENT",
        event: "TRADE_ALERT",
        status: "PUBLISHED"
      });
    } catch (error) {
      console.error("AfriForex WhatsApp E2E test error:", error);

      res.status(500).json({
        ok: false,
        certification: "AFRIFOREX_WHATSAPP_NOTIFICATION_E2E",
        error: error?.message || String(error)
      });
    }
  });
}
