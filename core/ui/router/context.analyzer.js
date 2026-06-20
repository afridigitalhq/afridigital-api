function analyzeContext(user) {

  return {
    isNewUser: (user.sessions || 0) < 3,
    isActiveEarner: (user.earnings || 0) > 50,
    isCreator: (user.jobsCreated || 0) > 2,
    isHighEngagement: (user.actions || 0) > 20
  };
}

module.exports = { analyzeContext };
