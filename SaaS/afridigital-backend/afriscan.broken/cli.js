#!/usr/bin/env node

const pipeline = require('../runtime/core/pipeline');
const collector = require('../runtime/core/collector');
const ui = require('../runtime/ui/render');

/**
 * HARD SAFETY LOCK
 * Reject accidental pasted UI / box-drawing / corrupted shell input
 */
function isSafeRuntime() {
  // If anything is piped into CLI, block it
  if (!process.stdin.isTTY) return false;

  return true;
}

function containsUIArtifacts(str = "") {
  const blacklist = [
    "┌", "└", "│", "├", "┤",
    "━━━━━━━━",
    "AFRISCAN CONTROL",
    "AFRISCAN OBSERVATORY"
  ];

  return blacklist.some(k => str.includes(k));
}

function run() {
  if (!isSafeRuntime()) {
    console.log("⛔ CLI SAFETY LOCK: Piped/invalid input blocked");
    process.exit(1);
  }

  const p = pipeline();
  const c = collector();

  console.clear();

  const output = ui.header(p);

  // Final guard: prevent accidental UI recursion injection
  if (containsUIArtifacts(output)) {
    console.log("⛔ UI CORRUPTION DETECTED: render blocked");
    process.exit(1);
  }

  console.log(output);
  console.log(ui.section("CORE"));
  console.log(ui.line("Score", p.score, p.state));
  console.log(ui.line("State", p.state, p.state));
  console.log(ui.line("Uptime", Math.floor(p.uptime) + "s"));
}

if (require.main === module) run();

module.exports = run;
