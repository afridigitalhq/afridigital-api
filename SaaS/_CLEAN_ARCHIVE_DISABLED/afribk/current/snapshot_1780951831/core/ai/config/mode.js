const MODE = process.env.AFRI_AI_MODE || "dev-mock";

const ALLOWED = ["dev-mock", "dev-local", "prod"];

if (!ALLOWED.includes(MODE)) {
  throw new Error("Invalid AI mode: " + MODE);
}

module.exports = { MODE };
