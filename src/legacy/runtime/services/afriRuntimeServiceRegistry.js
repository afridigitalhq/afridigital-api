const services={kernel:"runtime/kernel",state:"runtime/state",history:"runtime/history",events:"runtime/events",dispatcher:"runtime/dispatcher",logger:"runtime/logger",metrics:"runtime/metrics",snapshot:"runtime/snapshot",health:"runtime/health",diagnostics:"runtime/diagnostics"};

export function readServices(){return {...services};}

export function getService(name){return services[name]??null;}
