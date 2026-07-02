const express = require("express");
const router = express.Router();

const { getBalance } = require("../core/economy/wallet");
const { getActivity } = require("../core/economy/activity");
const { getNotifications } = require("../core/economy/notifications");

const bus = require("../core/eventbus");

router.post("/economy/earn", (req, res) => {

  bus.emit("EARN", req.body);

  res.json({ ok: true });
});

router.post("/economy/spend", (req, res) => {

  bus.emit("SPEND", req.body);

  res.json({ ok: true });
});

router.get("/economy/wallet/:userId", (req, res) => {
  res.json({ balance: getBalance(req.params.userId) });
});

router.get("/economy/activity", (req, res) => {
  res.json(getActivity());
});

router.get("/economy/notifications/:userId", (req, res) => {
  res.json(getNotifications(req.params.userId));
});

module.exports = router;
