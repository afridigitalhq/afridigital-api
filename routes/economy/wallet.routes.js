const express = require("express");
const router = express.Router();

const wallet = require("../../core/economy/wallet.engine");
const activity = require("../../core/economy/activity.engine");
const notifications = require("../../core/economy/notifications.engine");

router.get("/:userId", (req, res) => {
  res.json(wallet.read(req.params.userId));
});

router.post("/:userId/credit", (req, res) => {
  const { amount } = req.body;

  const updated = wallet.credit(req.params.userId, amount);

  activity.log(req.params.userId, "WALLET_CREDIT", { amount });
  notifications.add(req.params.userId, {
    title: "Wallet Credit",
    message: `You received $${amount}`
  });

  res.json(updated);
});

router.post("/:userId/debit", (req, res) => {
  const { amount } = req.body;

  const updated = wallet.debit(req.params.userId, amount);

  activity.log(req.params.userId, "WALLET_DEBIT", { amount });
  notifications.add(req.params.userId, {
    title: "Wallet Debit",
    message: `-$${amount} deducted`
  });

  res.json(updated);
});

module.exports = router;
