const CoreSecurityScanner={
 scan(target){
  return {target,issues:[],status:"SCANNED",scannedAt:new Date().toISOString()};
 }
};

export default CoreSecurityScanner;
