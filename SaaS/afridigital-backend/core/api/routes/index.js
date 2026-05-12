const { assertApiVersion } = require("../runtime/safety/api.guard");
const express = require('express');
const router = express.Router();

const dashboard =
require('../controllers/dashboard.controller');

const control =
require('../controllers/control.controller');

const system =
require('../controllers/system.controller');

// Dashboard metrics
router.get('/dashboard', dashboard.dashboard);

// System health
router.get('/system', system.systemHealth);

// Control flags
router.get('/control', control.getControl);
router.post('/control', control.updateControl);

module.exports = router;
