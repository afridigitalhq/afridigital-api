/**
 * LOOP GUARD - prevents self recursion storms
 */

export function shouldTrigger(lastCommands, newCmd) {
  const recent = lastCommands.slice(-5);

  const count = recent.filter(c => c.cmd === newCmd).length;

  if (count >= 3) {
    console.warn("⛔ LOOP BLOCKED:", newCmd);
    return false;
  }

  return true;
}
