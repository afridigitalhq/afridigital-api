const CoreQuotaManager={
 check(account,resource){
  return {account,resource,allowed:true,status:"QUOTA_OK"};
 }
};

export default CoreQuotaManager;
