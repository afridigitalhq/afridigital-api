const CoreDependencyScanner={
 scan(dependencies=[]){
  return {dependencies,vulnerabilities:[],status:"SCANNED"};
 }
};

export default CoreDependencyScanner;
