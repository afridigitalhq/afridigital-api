const LogUploadAdapter = {

  normalize(log = "") {

    return {
      source: "log",
      message: log,
      stack: log,
      metadata: {
        receivedAt: Date.now()
      }
    };

  }

};

export default LogUploadAdapter;
