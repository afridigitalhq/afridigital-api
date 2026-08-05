const AfriDebugPermissionManager={
  check(user,action){
    return {user,action,status:"PERMISSION_CHECKED"};
  }
};

export default AfriDebugPermissionManager;
