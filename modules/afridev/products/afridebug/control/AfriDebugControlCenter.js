const AfriDebugControlCenter={
  actions:[
    "DEBUG",
    "FIX",
    "ROLLBACK"
  ],

  execute(action){
    return {
      action,
      status:"READY"
    };
  }
};

export default AfriDebugControlCenter;
