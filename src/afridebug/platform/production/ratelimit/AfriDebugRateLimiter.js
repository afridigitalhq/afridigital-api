const AfriDebugRateLimiter={

  limits(){

    return{
      requestsPerMinute:60,
      burstLimit:100
    };

  },

  health(){

    return{
      service:"AfriDebugRateLimiter",
      status:"healthy"
    };

  }

};

export default AfriDebugRateLimiter;
