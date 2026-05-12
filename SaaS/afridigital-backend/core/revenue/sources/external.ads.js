const { assertApiVersion } = require("../runtime/safety/api.guard");
const externalAds = [
  {
    title: "Forex Trading Platform",
    link: "https://example-forex.com/ref=afri",
    type: "affiliate"
  },
  {
    title: "Tech SaaS Tool",
    link: "https://example-saas.com/signup?ref=afri",
    type: "affiliate"
  },
  {
    title: "Google Ad Placeholder",
    link: "https://google.com",
    type: "external"
  }
];

module.exports = { externalAds };
