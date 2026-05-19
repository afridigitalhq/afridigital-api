const router = require('express').Router();
const fs = require('fs');
const wallet = require('../services/afrios.wallet');
const auth = require('../services/afrios.auth');

const DB_PATH = './storage/os/state.db.json';

function load() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

// 👤 USER DASHBOARD (SAFE)
router.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  const db = load();

  res.json({
    wallet: wallet.getWallet(userId),
    withdrawals: db.withdrawals.filter(w => w.userId === userId),
    events: db.events.filter(e => e.data?.userId === userId)
  });
});

// 📊 ADMIN DASHBOARD (PROTECTED)
router.get('/admin/stats', (req, res) => {
  if (!auth.isAdmin(req)) {
    return res.status(403).json({ error: "UNAUTHORIZED" });
  }

  const db = load();

  res.json({
    users: Object.keys(db.wallets || {}).length,
    withdrawals: db.withdrawals.length,
    events: db.events.length,
    pendingWithdrawals: db.withdrawals.filter(w => w.status === "PENDING")
  });
});

module.exports = router;
