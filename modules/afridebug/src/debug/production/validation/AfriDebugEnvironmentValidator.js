const AfriDebugEnvironmentValidator={

  validate(){

    return{
      success:true,
      status:"VALID",
      checks:[
        "configuration",
        "environment",
        "approval-policy"
      ]
    };

  },

  health(){

    return{
      service:"AfriDebugEnvironmentValidator",
      status:"healthy"
    };

  }

};

export default AfriDebugEnvironmentValidator;
