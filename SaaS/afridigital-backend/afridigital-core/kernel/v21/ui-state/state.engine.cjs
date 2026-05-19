const stateStore = {};

function toggleAdView(adId) {
  stateStore[adId] =
    stateStore[adId] === "expanded" ? "collapsed" : "expanded";

  return stateStore[adId];
}

function getState(adId) {
  return stateStore[adId] || "collapsed";
}

module.exports = { toggleAdView, getState };
