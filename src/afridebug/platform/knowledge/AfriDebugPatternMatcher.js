const AfriDebugPatternMatcher = {

  match(issue = "", cases = []) {

    const results =
      cases.filter(item =>
        issue.toLowerCase()
        .includes(
          String(item.issue).toLowerCase()
        )
      );

    return {

      matches:results,

      confidence:
        results.length
        ? "HIGH"
        : "NONE"

    };

  },


  health(){

    return{
      service:"AfriDebugPatternMatcher",
      status:"healthy"
    };

  }

};

export default AfriDebugPatternMatcher;
