const fs = require('fs');

function loadRoute(filePath) {
  const mod = require(filePath);

  const router = mod?.router || mod;

  if (!router || (typeof router !== 'function' && typeof router !== 'object')) {
    throw new Error(`Invalid Express router: ${filePath}`);
  }

  return router;
}

module.exports = { loadRoute };
