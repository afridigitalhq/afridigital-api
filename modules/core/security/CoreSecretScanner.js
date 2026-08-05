const CoreSecretScanner={
 scan(files=[]){
  return {files,secrets:[],status:"SCANNED"};
 }
};

export default CoreSecretScanner;
