import express from "express";
import AfriForexDemoStore from "../../../modules/afriforex/storage/AfriForexDemoStore.js";
import AfriForexAccountValuation from "../../../modules/afriforex/account/AfriForexAccountValuation.js";
import AfriForexTradingOrchestrator from "../../../modules/afriforex/orchestration/AfriForexTradingOrchestrator.js";
import AfriForexDemoExecutionEngine from "../../../modules/afriforex/execution/AfriForexDemoExecutionEngine.js";
import AfriTradingProviderAggregator from "../../../modules/afriai/trading/intelligence/AfriTradingProviderAggregator.js";
import AfriPlatformEventBus from "../../../modules/platform/events/bus/AfriPlatformEventBus.js";

const router = express.Router();


router.get("/account", async (req, res) => {
  try {
    const customerId =
      String(req.query.customerId || "guest");

    const valuation =
      await AfriForexAccountValuation.value(customerId);

    res.json({
      ok: true,
      data: valuation
    });
  } catch (error) {
    console.error("AfriForex account valuation error:", error);

    res.status(500).json({
      ok: false,
      error: "AFRIFOREX_ACCOUNT_UNAVAILABLE"
    });
  }
});

router.get("/positions", (req, res) => {
  try {
    const customerId =
      String(req.query.customerId || "guest");

    res.json({
      ok: true,
      data: AfriForexDemoStore.getOpenPositions(customerId)
    });
  } catch (error) {
    console.error("AfriForex positions error:", error);

    res.status(500).json({
      ok: false,
      error: "AFRIFOREX_POSITIONS_UNAVAILABLE"
    });
  }
});

router.get("/history", (req, res) => {
  try {
    const customerId =
      String(req.query.customerId || "guest");

    res.json({
      ok: true,
      data: AfriForexDemoStore.getHistory(customerId)
    });
  } catch (error) {
    console.error("AfriForex history error:", error);

    res.status(500).json({
      ok: false,
      error: "AFRIFOREX_HISTORY_UNAVAILABLE"
    });
  }
});

router.get("/notification-preferences", (req, res) => {
  try {
    const customerId = String(req.query.customerId || "guest");
    const preferences = AfriForexDemoStore.getPreferences(customerId);

    res.json({
      ok: true,
      data: {
        customerId,
        notificationPreferences: preferences.notificationPreferences
      }
    });
  } catch (error) {
    console.error("AfriForex notification preferences error:", error);
    res.status(500).json({
      ok: false,
      error: "AFRIFOREX_NOTIFICATION_PREFERENCES_UNAVAILABLE"
    });
  }
});

router.post("/notification-preferences", (req, res) => {
  try {
    const customerId = String(req.body?.customerId || "guest");
    const current = AfriForexDemoStore.getPreferences(customerId);
    const incoming = req.body?.notificationPreferences || {};

    const notificationPreferences = {
      ...current.notificationPreferences,
      ...incoming,
      channels: {
        ...current.notificationPreferences.channels,
        ...(incoming.channels || {})
      }
    };

    const updated = AfriForexDemoStore.savePreferences({
      ...current,
      customerId,
      notificationPreferences
    });

    res.json({
      ok: true,
      data: {
        customerId,
        notificationPreferences: updated.notificationPreferences
      }
    });
  } catch (error) {
    console.error("AfriForex save notification preferences error:", error);
    res.status(500).json({
      ok: false,
      error: "AFRIFOREX_NOTIFICATION_PREFERENCES_SAVE_FAILED"
    });
  }
});

router.post("/scan", async (req, res) => {
  try {
    const customerId = String(req.body?.customerId || "guest");
    const markets = Array.isArray(req.body?.markets) ? req.body.markets : null;
    const result = await AfriForexTradingOrchestrator.scan(customerId, markets);
    res.json({ ok: true, data: result });
  } catch (error) {
    console.error("AfriForex scan error:", error);
    res.status(500).json({ ok: false, error: "AFRIFOREX_SCAN_UNAVAILABLE" });
  }
});

router.post("/close", async (req, res) => {
  try {
    const customerId = String(req.body?.customerId || "guest");
    const positionId = String(req.body?.positionId || "");

    if (!positionId) {
      return res.status(400).json({
        ok: false,
        error: "POSITION_ID_REQUIRED"
      });
    }

    const positions =
      AfriForexDemoStore.getOpenPositions(customerId);

    const position =
      positions.find(item => item.positionId === positionId);

    if (!position) {
      return res.status(404).json({
        ok: false,
        error: "OPEN_POSITION_NOT_FOUND"
      });
    }

    const evidence =
      await AfriTradingProviderAggregator.collect({
        assetType: position.assetType,
        symbol: position.symbol
      });

    const usable =
      evidence.results.find(
        result =>
          result.status === "AVAILABLE" &&
          result.evidence?.data?.price
      );

    const exitPrice =
      Number(usable?.evidence?.data?.price);

    if (!Number.isFinite(exitPrice) || exitPrice <= 0) {
      return res.status(503).json({
        ok: false,
        error: "AFRIFOREX_EXIT_PRICE_UNAVAILABLE"
      });
    }

    const result =
      AfriForexDemoExecutionEngine.close({
        customerId,
        positionId,
        exitPrice,
        reason: "MANUAL_CLOSE"
      });

    if (result.status !== "CLOSED") {
      return res.status(400).json({
        ok: false,
        error: result.reason || "AFRIFOREX_POSITION_CLOSE_FAILED",
        data: result
      });
    }

    res.json({
      ok: true,
      data: result
    });
  } catch (error) {
    console.error("AfriForex close error:", error);

    res.status(500).json({
      ok: false,
      error: "AFRIFOREX_CLOSE_UNAVAILABLE"
    });
  }
});

router.post("/trade", async (req, res) => {
  try {
    const result = await AfriForexTradingOrchestrator.trade(req.body || {});
    res.json({ ok: true, data: result });
  } catch (error) {
    console.error("AfriForex trade error:", error);
    res.status(500).json({ ok: false, error: "AFRIFOREX_TRADE_UNAVAILABLE" });
  }
});

export default router;
