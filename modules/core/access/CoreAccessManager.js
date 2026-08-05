const CoreAccessManager={
 grant(user,permission){
  return {user,permission,status:"GRANTED"};
 },
 revoke(user,permission){
  return {user,permission,status:"REVOKED"};
 }
};

export default CoreAccessManager;
