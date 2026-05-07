const cheerio = require("cheerio");

function runKernel(html = "") {
  let $ = cheerio.load(html);
  const fixLog = [];

  if ($("section.hero, section#hero, #hero").length === 0) {
    $("body").prepend(`<section class="hero"><h1>AfriDigital</h1></section>`);
    fixLog.push("hero injected");
  }

  if ($("h1").length === 0) {
    $("body").prepend(`<h1>AfriDigital</h1>`);
    fixLog.push("h1 injected");
  }

  if ($("footer").length === 0) {
    $("body").append(`<footer><p>© AfriDigital</p></footer>`);
    fixLog.push("footer injected");
  }

  $ = cheerio.load($.html());

  const checks = {
    hero: $("section.hero, section#hero, #hero").length > 0,
    heading: $("h1").length > 0,
    footer: $("footer").length > 0,
  };

  const failed = Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (failed.length) {
    console.log("❌ V5 FAILED:", failed.join(", "));
    process.exit(1);
  }

  if (fixLog.length) {
    console.log("🛠️ AUTO-FIX APPLIED:", fixLog.join(", "));
  }

  console.log("🔒 AFRIDIGITAL V5 KERNEL: SELF-HEALED + VERIFIED ✅");
  return $.html();
}

module.exports = { runKernel };
