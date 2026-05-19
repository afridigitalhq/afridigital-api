const storage = require("./report.storage.v10.1");
const analytics = require("./analytics.aggregate.v10.1");

class ReportGeneratorV10_1 {

  generateUserReport(userId, range="monthly") {

    const report = {

      id:
        "RPT_" + Date.now(),

      type: "user",

      userId,

      range,

      generatedAt: Date.now(),

      summary: {
        transactions:
          Math.floor(Math.random()*20),

        inflow:
          Math.floor(Math.random()*100000),

        outflow:
          Math.floor(Math.random()*50000)
      }
    };

    storage.save(report);

    return {
      ok: true,
      report
    };
  }

  generateAdminReport(range="monthly") {

    const metrics =
      analytics.snapshot().metrics;

    const report = {

      id:
        "ADMIN_" + Date.now(),

      type: "admin",

      range,

      generatedAt: Date.now(),

      metrics
    };

    storage.save(report);

    return {
      ok: true,
      report
    };
  }

  snapshot() {

    return {
      ok: true,
      reportsStored:
        storage.all().length
    };
  }
}

module.exports = new ReportGeneratorV10_1();
