import {statusIcon} from "./AfriStatus.js";

export function renderStatus(label,status,value){return label+": "+statusIcon(status)+" "+String(value);}

export function renderDecision(decision){return "DECISION: 🟡 "+String(decision);}

export function renderReport(report){return "REPORT: 🔵 "+String(report);}
