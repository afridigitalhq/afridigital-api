const CoreReportGenerator={
 generate(input={}){
  return {input,status:"REPORT_READY",generatedAt:new Date().toISOString()};
 }
};

export default CoreReportGenerator;
