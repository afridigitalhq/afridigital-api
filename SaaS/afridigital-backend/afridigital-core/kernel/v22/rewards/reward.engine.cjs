function rewardUser(event) {

  let reward = 0;

  if (event.type === "AD_VIEW") reward = 1;
  if (event.type === "JOB_COMPLETE") reward = 50;
  if (event.type === "REFERRAL") reward = 30;

  return {
    credited: reward,
    message: "Reward added to wallet"
  };
}

module.exports = { rewardUser };
