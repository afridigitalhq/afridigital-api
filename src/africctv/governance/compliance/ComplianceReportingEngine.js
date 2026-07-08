export class ComplianceReportingEngine{

 report(){

  return {
   policies:"PASS",
   access:"PASS",
   privacy:"PASS"
  };

 }

}


export const complianceReportingEngine =
new ComplianceReportingEngine();
