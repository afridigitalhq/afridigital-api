import AfriForexDemoStore from "../../../afriforex/storage/AfriForexDemoStore.js";
import AfriNotificationProviders from "../../notifications/providers/AfriNotificationProviders.js";

const AfriPlatformEventHandler = {
  async handle(event, payload = {}) {
    const customerId = payload.customerId || "guest";
    const preferences = AfriForexDemoStore.getPreferences(customerId);
    const notificationPreferences =
      preferences.notificationPreferences || {};

    if (notificationPreferences.enabled !== true) {
      return {
        event,
        customerId,
        status: "SKIPPED",
        reason: "NOTIFICATIONS_DISABLED",
        deliveries: []
      };
    }

    const channels = notificationPreferences.channels || {};
    const deliveries = [];

    for (const [channel, enabled] of Object.entries(channels)) {
      if (enabled !== true) {
        continue;
      }

      const provider = AfriNotificationProviders.get(channel);

      if (!provider) {
        deliveries.push({
          channel,
          status: "SKIPPED",
          reason: "NO_PROVIDER"
        });
        continue;
      }

      try {
        const notification = {
          event,
          customerId,
          payload
        };

        let result;

        if (typeof provider.notify === "function") {
          result = await provider.notify(notification);
        } else if (typeof provider.send === "function") {
          result = await provider.send(notification);
        } else {
          deliveries.push({
            channel,
            status: "SKIPPED",
            reason: "INVALID_PROVIDER"
          });
          continue;
        }

        deliveries.push({
          channel,
          status: "DELIVERED",
          result
        });
      } catch (error) {
        deliveries.push({
          channel,
          status: "ERROR",
          error: error?.message || String(error)
        });
      }
    }

    return {
      event,
      customerId,
      status: "PROCESSED",
      deliveries
    };
  }
};

export default AfriPlatformEventHandler;
