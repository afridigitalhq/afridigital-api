function selectAd(context) {

  const ads = [
    { id: 1, type: "job", content: "Earn from WhatsApp tasks today" },
    { id: 2, type: "promo", content: "Promote your business on AfriDigital" },
    { id: 3, type: "service", content: "Build your website instantly with us" }
  ];

  // simple contextual match
  if (context?.intent === "earning") return ads[0];
  if (context?.intent === "business") return ads[1];

  return ads[2];
}

module.exports = { selectAd };
