import AfriForexDemoStore from "../../../afriforex/storage/AfriForexDemoStore.js";
import AfriWhatsAppProviderGateway from "../../../afriwhatsapp/provider-runtime/AfriWhatsAppProviderGateway.js";

const AfriWhatsAppNotificationProvider = {
  async notify(notification = {}) {
    const customerId = notification.customerId || "guest";
    const preferences = AfriForexDemoStore.getPreferences(customerId);
    const destination =
      preferences.notificationPreferences?.destinations?.afriWhatsApp;

    if (!destination?.phone) {
      return {
        status: "SKIPPED",
        reason: "NO_WHATSAPP_DESTINATION"
      };
    }

    const payload = notification.payload || {};
    const market = payload.market || payload.symbol || "AfriForex";
    const direction =
      payload.currentState?.scalpDirection ||
      payload.direction ||
      "NEUTRAL";
    const strength =
      payload.currentState?.scalpMomentumStrengthPercent ??
      payload.momentumStrengthPercent;

    const message = [
      "📊 AfriAI Trade Alert",
      `Market: ${market}`,
      `Direction: ${direction}`,
      strength != null ? `SCALP Strength: ${strength}%` : null,
      payload.changes?.directionChanged
        ? `Direction Change: ${payload.changes.directionChanged.from} → ${payload.changes.directionChanged.to}`
        : null,
      payload.changes?.reversal?.detected
        ? "⚠️ Incoming SCALP Reversal"
        : null
    ].filter(Boolean).join("\n");

    return await AfriWhatsAppProviderGateway.sendMessage({
      to: destination.phone,
      response: message
    });
  }
};

export default AfriWhatsAppNotificationProvider;
