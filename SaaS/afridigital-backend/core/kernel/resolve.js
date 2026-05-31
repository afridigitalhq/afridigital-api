const path = require('path');

/**
 * GLOBAL ROOT RESOLVER (Render-safe)
 * Ensures all modules resolve from project root reliably
 */
global.__root = path.resolve(__dirname, '../../..');

module.exports = global.__root;
