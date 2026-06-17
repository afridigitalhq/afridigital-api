const { addToReplay } = require('../workers/replay.worker');

/**
 * Safe replay attachment layer
 * NEVER blocks main flow
 */
function attachReplay(result, intent, message, payload) {
  try {
    if (!result || result.ok === false) {
      addToReplay({
        flow: intent?.primary || 'systemFlow',
        context: {
          input: {
            text: message,
            from: payload?.from
          },
          intent
        }
      });
    }
  } catch (e) {
    console.error('Replay attach failed:', e.message);
  }

  return result;
}

module.exports = { attachReplay };
