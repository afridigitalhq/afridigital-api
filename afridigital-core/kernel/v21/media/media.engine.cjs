function attachMedia(ad) {
  return {
    ...ad,
    media: {
      thumbnail: ad.image || "default.jpg",
      previewType: "image"
    }
  };
}

module.exports = { attachMedia };
