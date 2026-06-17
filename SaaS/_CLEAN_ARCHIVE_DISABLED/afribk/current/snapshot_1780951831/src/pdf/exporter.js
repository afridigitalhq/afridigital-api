const PDFDocument = require("pdfkit");

async function generateUserReport(data) {
  const doc = new PDFDocument();

  doc.text("AfriDigital User Report");
  doc.moveDown();

  doc.text(JSON.stringify(data, null, 2));

  doc.end();

  return doc;
}

module.exports = { generateUserReport };
