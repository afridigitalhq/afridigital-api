const express = require('express');
const router = express.Router();

const cards =
require('../services/cards/interactiveCardEngine');

router.get('/welcome/:number', async (req, res) => {

  const number = req.params.number;

  const data =
    await cards.sendWelcomeCard(number);

  res.json(data);
});

router.get('/task/:number', async (req, res) => {

  const number = req.params.number;

  const data =
    await cards.sendTaskCard(number);

  res.json(data);
});

router.get('/ad/:number', async (req, res) => {

  const number = req.params.number;

  const data =
    await cards.sendAdCard(number);

  res.json(data);
});

router.get('/wallet/:number', async (req, res) => {

  const number = req.params.number;

  const data =
    await cards.sendWalletCard(number);

  res.json(data);
});

module.exports = router;
