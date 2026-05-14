class ReportStorageV10_1 {

  constructor() {

    this.reports = [];
  }

  save(report) {

    this.reports.push({
      ...report,
      storedAt: Date.now()
    });

    return {
      ok: true,
      totalReports: this.reports.length
    };
  }

  getUserReports(userId) {

    return this.reports.filter(
      r => r.userId === userId
    );
  }

  all() {

    return this.reports;
  }

  snapshot() {

    return {
      ok: true,
      reports: this.reports.length
    };
  }
}

module.exports = new ReportStorageV10_1();
