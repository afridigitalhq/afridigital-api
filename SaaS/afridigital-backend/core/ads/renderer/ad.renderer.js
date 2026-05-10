function renderAdCard(ad) {

return `
📢 Sponsored Ad

━━━━━━━━━━━━━━━
${ad.title}
${ad.description}

👉 Click here:
${ad.link}

━━━━━━━━━━━━━━━
`;
}

module.exports = { renderAdCard };
