function detectFraud(event) {
  let risk = 0;

  if (event.clicks > 20) risk += 40;
  if (event.sameIp === true) risk += 30;
  if (event.botPattern === true) risk += 50;

  return {
    safe: risk < 60,
    risk
  };
}

module.exports = { detectFraud };
