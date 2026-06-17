const { wrapFs } = require('./guard');

// activate freeze immediately
wrapFs();

console.log('🧊 KERNEL FREEZE ACTIVE (HARD MODE)');
