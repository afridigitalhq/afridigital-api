const history = [];

function logRequest(data) {
  history.push({
    ...data,
    ts: Date.now()
  });

  if (history.length > 500) history.shift();
}

function getStats(apiKey) {
  const logs = history.filter(x => x.apiKey === apiKey);

  return {
    totalRequests: logs.length,
    avgLatency: logs.reduce((a,b)=>a+b.latency,0) / (logs.length || 1),
    providers: logs.reduce((acc,x)=>{
      acc[x.provider] = (acc[x.provider] || 0) + 1;
      return acc;
    }, {})
  };
}

function getAll() {
  return history;
}

module.exports = { logRequest, getStats, getAll };
