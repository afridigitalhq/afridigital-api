export const AfriStatus={PASS:"PASS",REVIEW:"REVIEW",FAIL:"FAIL",INFO:"INFO"};

export const AfriStatusVisual={PASS:"🟢",REVIEW:"🟡",FAIL:"🔴",INFO:"🔵"};

export function statusIcon(status){return AfriStatusVisual[status]||AfriStatusVisual.INFO;}

export function formatStatus(label,status,value){return label+": "+statusIcon(status)+" "+String(value);}

export default AfriStatus;
