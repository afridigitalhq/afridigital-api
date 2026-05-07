function createAdCard(ad) {
  return {
    id: ad.id,
    type: "compact_card",

    compact: {
      title: ad.title,
      description: ad.shortText,
      image: ad.image || null,
      cta: "View"
    },

    expanded: {
      title: ad.title,
      description: ad.fullText,
      image: ad.image,
      actions: ad.actions || []
    },

    state: "collapsed"
  };
}

module.exports = { createAdCard };
