const CoreAccessEngine={
 check(user,permission){
  return {
   user,
   permission,
   allowed:false,
   checkedAt:new Date().toISOString()
  };
 }
};

export default CoreAccessEngine;
