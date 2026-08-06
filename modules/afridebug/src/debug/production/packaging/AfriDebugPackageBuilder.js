const AfriDebugPackageBuilder={

  build(version="1.0.0"){

    return{

      package:`AfriDebug-${version}.zip`,

      generated:true,

      builtAt:Date.now()

    };

  },

  health(){

    return{

      service:"AfriDebugPackageBuilder",

      status:"healthy"

    };

  }

};

export default AfriDebugPackageBuilder;
